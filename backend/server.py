from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import PROJECTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


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
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "THE STUDIO M API"}


@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
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
    return enquiry


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries():
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Enquiry(**d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_projects():
    """Seed projects collection on startup if empty (keeps slugs/URLs stable)."""
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
