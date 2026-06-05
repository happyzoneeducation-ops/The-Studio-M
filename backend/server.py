from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend

from seed_data import PROJECTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email / admin config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ALERT_RECIPIENT = os.environ.get('ALERT_RECIPIENT', 'info@thestudiom.online')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin')
resend.api_key = RESEND_API_KEY

# Stateless-ish session token (regenerated on restart)
ADMIN_TOKEN = secrets.token_urlsafe(32)

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------------- Models ----------------
class Result(BaseModel):
    label: str
    value: str


class Project(BaseModel):
    id: str
    title: str
    category: str
    year: str
    cover: str
    size: str = "small"
    summary: str
    services: List[str] = []
    scope: str = ""
    results: List[Result] = []
    gallery: List[str] = []
    order: int = 0


class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""
    service: Optional[str] = ""
    message: str


class Enquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = ""
    service: Optional[str] = ""
    message: str
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LoginRequest(BaseModel):
    username: str
    password: str


# ---------------- Email helper ----------------
def _build_email_html(enq: Enquiry) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; background:#0a0a0b; padding:32px; color:#ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background:#141416; border-radius:14px; overflow:hidden;">
        <tr><td style="padding:28px 28px 8px;">
          <p style="margin:0; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#b8a4f5;">THE STUDIO M — New Enquiry</p>
          <h1 style="margin:8px 0 0; font-size:24px; color:#ffffff;">{enq.name}</h1>
        </td></tr>
        <tr><td style="padding:8px 28px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#e6e6e6;">
            <tr><td style="padding:6px 0; color:#9a9aa2; width:120px;">Email</td><td style="padding:6px 0;"><a href="mailto:{enq.email}" style="color:#b8a4f5; text-decoration:none;">{enq.email}</a></td></tr>
            <tr><td style="padding:6px 0; color:#9a9aa2;">Company</td><td style="padding:6px 0;">{enq.company or '—'}</td></tr>
            <tr><td style="padding:6px 0; color:#9a9aa2;">Service</td><td style="padding:6px 0;">{enq.service or '—'}</td></tr>
            <tr><td style="padding:6px 0; color:#9a9aa2; vertical-align:top;">Message</td><td style="padding:6px 0; line-height:1.5;">{enq.message}</td></tr>
            <tr><td style="padding:6px 0; color:#9a9aa2;">Received</td><td style="padding:6px 0;">{enq.created_at}</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="text-align:center; color:#6a6a72; font-size:12px; margin-top:18px;">Sent automatically by thestudiom.online</p>
    </div>
    """


async def send_enquiry_email(enq: Enquiry):
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping email notification")
        return
    params = {
        "from": SENDER_EMAIL,
        "to": [ALERT_RECIPIENT],
        "reply_to": enq.email,
        "subject": f"New enquiry from {enq.name} — THE STUDIO M",
        "html": _build_email_html(enq),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Enquiry email sent to %s", ALERT_RECIPIENT)
    except Exception as e:
        logger.error("Failed to send enquiry email: %s", e)


# ---------------- Auth ----------------
async def require_admin(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ---------------- Public routes ----------------
@api_router.get("/")
async def root():
    return {"message": "THE STUDIO M API"}


@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("order", 1).limit(200).to_list(200)
    return [Project(**d) for d in docs]


@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**doc)


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate):
    if not payload.name.strip() or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Name and message are required")
    enquiry = Enquiry(**payload.dict())
    await db.enquiries.insert_one(enquiry.dict())
    # Fire-and-forget email so the API response is never blocked
    asyncio.create_task(send_enquiry_email(enquiry))
    return enquiry


# ---------------- Admin routes ----------------
@api_router.post("/admin/login")
async def admin_login(payload: LoginRequest):
    if payload.username == ADMIN_USERNAME and payload.password == ADMIN_PASSWORD:
        return {"token": ADMIN_TOKEN, "username": ADMIN_USERNAME}
    raise HTTPException(status_code=401, detail="Invalid username or password")


@api_router.get("/admin/enquiries", response_model=List[Enquiry])
async def admin_list_enquiries(_: bool = Depends(require_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).limit(500).to_list(500)
    return [Enquiry(**d) for d in docs]


@api_router.get("/admin/stats")
async def admin_stats(_: bool = Depends(require_admin)):
    total = await db.enquiries.count_documents({})
    new = await db.enquiries.count_documents({"status": "new"})
    return {"total": total, "new": new, "read": total - new}


@api_router.patch("/admin/enquiries/{enquiry_id}")
async def admin_update_enquiry(enquiry_id: str, _: bool = Depends(require_admin)):
    res = await db.enquiries.update_one({"id": enquiry_id}, {"$set": {"status": "read"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.delete("/admin/enquiries/{enquiry_id}")
async def admin_delete_enquiry(enquiry_id: str, _: bool = Depends(require_admin)):
    res = await db.enquiries.delete_one({"id": enquiry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_projects():
    try:
        count = await db.projects.count_documents({})
        if count == 0:
            await db.projects.insert_many([dict(p) for p in PROJECTS])
            logger.info("Seeded %d projects", len(PROJECTS))
        else:
            logger.info("Projects already seeded (%d)", count)
    except Exception as e:
        logger.error("Seeding failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
