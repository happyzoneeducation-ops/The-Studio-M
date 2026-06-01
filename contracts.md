# THE STUDIO M — API Contracts

## Goal
Move Projects (case studies) and the Contact form from frontend mock to backend (FastAPI + MongoDB).
Static marketing content (services, stats, philosophy, process, clients) stays in `mock.js` (not data-driven).

## Data currently mocked in frontend (`/app/frontend/src/mock.js`)
- `projects` → MOVE to backend (`projects` collection), seeded on startup.
- Contact form submission → currently saved to `localStorage` → MOVE to backend (`enquiries` collection).
- `services`, `stats`, `philosophy`, `process`, `clients`, `studio` → STAY in mock (static content).

## MongoDB Collections
### projects
```
{ id: str (slug), title, category, year, cover, size ("large"|"small"),
  summary, services: [str], scope, results: [{label, value}], gallery: [str], order: int }
```
Seeded from backend `seed_data.py` (same ids/content as previous mock so URLs stay valid).

### enquiries
```
{ id: uuid, name, email, company, service, message, created_at: iso }
```

## API Endpoints (all prefixed with /api)
- `GET /api/projects` → `[Project]` sorted by `order`.
- `GET /api/projects/{id}` → `Project` | 404.
- `POST /api/enquiries` → body `{name, email, company?, service?, message}` → `{id, ...}`; validates required name/email/message.
- `GET /api/enquiries` → `[Enquiry]` (admin/debug, newest first).

## Frontend integration
- New `src/api.js` using `REACT_APP_BACKEND_URL` + `/api`.
- `Home.jsx` (SelectedWork) + `Work.jsx`: fetch `GET /api/projects`.
- `CaseStudyDetail.jsx`: fetch `GET /api/projects/{id}` (loading + not-found states).
- `Contact.jsx`: `POST /api/enquiries` (replace localStorage), keep toast UX.
- Remove `projects` import from mock usage in those pages; keep static imports.
