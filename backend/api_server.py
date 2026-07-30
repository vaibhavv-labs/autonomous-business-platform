"""
FastAPI Backend — Autonomous Business Platform v4
🆓 100% FREE stack:
  - Text/AI: Groq (free 14,400 req/day, LLaMA 3 70B — fastest AI on earth)
  - Images: Pollinations Flux (free, unlimited, no key)
  - Video: Replicate (needs credit — optional)
"""
import asyncio
import json
import logging
import os
import re
import uuid
import urllib.parse
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import time
from collections import defaultdict
import httpx
import uvicorn
from fastapi import BackgroundTasks, FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from groq import AsyncGroq
import database as db

load_dotenv(dotenv_path=Path(__file__).parent / ".env", override=True)

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("abp")

# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(title="Autonomous Business Platform API", version="4.0.0", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Task 14: Rate Limiting Middleware (Sliding Window: 60 req/min) ──────────
_rate_limit_store = defaultdict(list)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    path = request.url.path
    if path in ["/", "/health", "/docs", "/openapi.json"] or path.startswith("/ws"):
        return await call_next(request)

    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    window = 60  # seconds
    limit = 60   # max requests per minute

    requests_history = [t for t in _rate_limit_store[client_ip] if now - t < window]
    _rate_limit_store[client_ip] = requests_history

    if len(requests_history) >= limit:
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded. Please wait a minute before making more requests.",
                "code": "TOO_MANY_REQUESTS",
                "retry_after_seconds": 60,
            },
        )

    _rate_limit_store[client_ip].append(now)
    return await call_next(request)

# ─── Task 16: Custom Global Exception Handlers ───────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": str(exc.detail), "code": f"HTTP_{exc.status_code}"},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "An unexpected error occurred. Please try again later.",
            "code": "INTERNAL_SERVER_ERROR",
        },
    )

# ─── Job Store ───────────────────────────────────────────────────────────────
_jobs: Dict[str, Dict] = {}


def _new_job(job_type: str, description: str, params: Dict) -> Dict:
    job_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    job = {
        "id": job_id, "type": job_type, "description": description,
        "params": params, "status": "queued", "progress": 0,
        "result": None, "error": None, "created_at": now,
        "started_at": None, "completed_at": None, "logs": [],
    }
    _jobs[job_id] = job
    return job


def _update_job(job_id: str, **kwargs):
    if job_id in _jobs:
        _jobs[job_id].update(kwargs)


# ─── Groq AI Helper (FREE — 14,400 req/day, LLaMA 3 70B) ───────────────────

GROQ_MODELS = [
    "llama-3.3-70b-versatile",   # Best quality — 14,400 req/day free
    "llama3-70b-8192",           # Fallback
    "mixtral-8x7b-32768",        # Fallback 2
]


def _get_groq_client() -> AsyncGroq:
    key = os.getenv("GROQ_API_KEY", "")
    if not key:
        raise ValueError(
            "GROQ_API_KEY is not set. Get your FREE key at https://console.groq.com → API Keys → Create. "
            "It takes 2 minutes and is completely free."
        )
    return AsyncGroq(api_key=key)


async def _llm(prompt: str, system: str = "", max_tokens: int = 2000, temperature: float = 0.8) -> str:
    """Call Groq LLaMA 3 70B — free, fast (avg 500 tokens/sec), reliable."""
    client = _get_groq_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    last_error = None
    for model in GROQ_MODELS:
        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            last_error = str(e)
            if "rate_limit" in str(e).lower() or "429" in str(e):
                logger.warning(f"Rate limit on {model}, trying next...")
                await asyncio.sleep(3)
                continue
            logger.error(f"Groq error on {model}: {e}")
            raise

    raise RuntimeError(f"All Groq models failed. Last error: {last_error}")


# ─── Pollinations Image Helper (FREE — Flux, no key, unlimited) ──────────────

def _image_url(prompt: str, width: int = 1024, height: int = 1024, seed: int = 42) -> str:
    """Build Pollinations Flux image URL — completely free, no API key."""
    encoded = urllib.parse.quote(prompt, safe="")
    return (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width={width}&height={height}&model=flux&nologo=true&enhance=true&seed={seed}"
    )


# ─── Pydantic Models with Strict Validation (Task 15) ───────────────────────

class CampaignRequest(BaseModel):
    product_description: str = Field(..., min_length=2, max_length=2000, description="Product description")
    target_audience: str = Field(default="", max_length=1000)
    budget: float = Field(default=5000.0, ge=0, le=1000000)
    platforms: List[str] = Field(default=["Instagram", "Facebook", "TikTok"])
    campaign_goal: str = Field(default="Brand Awareness", max_length=255)
    campaign_tone: str = Field(default="Professional", max_length=255)
    competitor_info: str = Field(default="", max_length=2000)

class ImageRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=2000)
    model: str = Field(default="flux", max_length=100)
    width: int = Field(default=1024, ge=256, le=2048)
    height: int = Field(default=1024, ge=256, le=2048)
    num_outputs: int = Field(default=1, ge=1, le=4)
    style: str = Field(default="", max_length=100)
    color_palette: str = Field(default="", max_length=100)

class VideoRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=2000)
    model: str = Field(default="minimax/video-01", max_length=100)
    duration: int = Field(default=5, ge=1, le=30)
    aspect_ratio: str = Field(default="16:9", max_length=20)

class ContentRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=1000)
    content_type: str = Field(default="blog_post", max_length=100)
    tone: str = Field(default="Professional", max_length=100)
    target_audience: str = Field(default="", max_length=1000)
    keywords: List[str] = Field(default=[])
    word_count: int = Field(default=500, ge=50, le=5000)

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str = Field(default="", max_length=100)
    context: Dict[str, Any] = Field(default={})

class ContactRequest(BaseModel):
    product_description: str = Field(..., min_length=2, max_length=2000)
    target_market: str = Field(default="", max_length=1000)
    contact_types: List[str] = Field(default=["influencer", "blogger"])
    num_contacts: int = Field(default=20, ge=1, le=50)

# ─── CRUD Pydantic Models ───────────────────────────────────────────────────

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=3, max_length=255)
    product: Optional[str] = Field(default="", max_length=255)
    status: Optional[str] = Field(default="Active", max_length=50)
    spent: Optional[float] = Field(default=0.0, ge=0)
    joined: Optional[str] = Field(default="", max_length=50)

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    product: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default=None, max_length=50)
    spent: Optional[float] = Field(default=None, ge=0)

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: Optional[str] = Field(default="", max_length=255)
    company: Optional[str] = Field(default="", max_length=255)
    channel: Optional[str] = Field(default="Email", max_length=100)
    score: Optional[int] = Field(default=5, ge=1, le=10)
    strategy: Optional[str] = Field(default="", max_length=2000)
    email: Optional[str] = Field(default="", max_length=255)
    status: Optional[str] = Field(default="New", max_length=50)

class ContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    role: Optional[str] = Field(default=None, max_length=255)
    company: Optional[str] = Field(default=None, max_length=255)
    channel: Optional[str] = Field(default=None, max_length=100)
    score: Optional[int] = Field(default=None, ge=1, le=10)
    strategy: Optional[str] = Field(default=None, max_length=2000)
    email: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default=None, max_length=50)

class ProductCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    prompt: Optional[str] = Field(default="", max_length=2000)
    style: Optional[str] = Field(default="", max_length=100)
    color_palette: Optional[str] = Field(default="", max_length=100)
    image_url: str = Field(..., min_length=5)
    price: Optional[float] = Field(default=29.99, ge=0)
    status: Optional[str] = Field(default="Active", max_length=50)

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None

# ─── Health ──────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    groq_key = bool(os.getenv("GROQ_API_KEY"))
    return {
        "name": "Autonomous Business Platform API",
        "version": "4.0.0",
        "status": "running",
        "docs": "/docs",
        "ai_ready": groq_key,
        "powered_by": "Groq (free) + Pollinations (free)",
    }

@app.get("/health")
async def health():
    groq_key = bool(os.getenv("GROQ_API_KEY"))
    replicate_token = os.getenv("REPLICATE_API_TOKEN", "")
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_text": "groq_ready" if groq_key else "needs_groq_key",
        "ai_images": "pollinations_flux_free",
        "ai_video": "replicate_ready" if replicate_token.startswith("r8_") else "add_replicate_credit",
        "groq_configured": groq_key,
        "replicate_configured": replicate_token.startswith("r8_"),
    }

# ─── Jobs ─────────────────────────────────────────────────────────────────────

@app.get("/api/jobs")
async def list_jobs(limit: int = 50, status: Optional[str] = None):
    jobs = list(_jobs.values())
    if status:
        jobs = [j for j in jobs if j["status"] == status]
    jobs.sort(key=lambda j: j["created_at"], reverse=True)
    return {"jobs": jobs[:limit], "total": len(jobs)}

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return _jobs[job_id]

@app.delete("/api/jobs/{job_id}")
async def cancel_job(job_id: str):
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    _update_job(job_id, status="cancelled")
    return {"message": "Job cancelled"}

# ─── Images (FREE via Pollinations Flux) ─────────────────────────────────────

async def _run_image_generation(job_id: str, req: ImageRequest):
    try:
        _update_job(job_id, status="running", started_at=datetime.utcnow().isoformat(),
                    progress=20, logs=["Building prompt..."])

        prompt = req.prompt
        if req.style:
            prompt += f", {req.style} style"
        if req.color_palette:
            prompt += f", {req.color_palette} colors"

        _update_job(job_id, progress=40, logs=["Generating with Flux AI (free)..."])

        images = []
        variations = [
            "masterpiece, studio lighting",
            "vibrant colors, crisp focus",
            "8k resolution, elegant detail",
            "professional product design",
        ]
        import random
        for i in range(req.num_outputs):
            seed = random.randint(100000, 999999)
            p_variant = f"{prompt}, {variations[i % len(variations)]}"
            url = _image_url(p_variant, req.width, req.height, seed=seed)
            images.append(url)
            _update_job(job_id, progress=40 + int(55 * (i + 1) / req.num_outputs),
                        logs=[f"Image {i+1}/{req.num_outputs} ready"])

        _update_job(job_id, status="completed", progress=100,
                    result={"images": images},
                    completed_at=datetime.utcnow().isoformat(),
                    logs=["All images ready! ✅"])
    except Exception as e:
        logger.error(f"Image failed: {e}")
        _update_job(job_id, status="failed", error=str(e), completed_at=datetime.utcnow().isoformat())

@app.post("/api/images/generate")
async def generate_image(request: ImageRequest, background_tasks: BackgroundTasks):
    job = _new_job("image_generation", f"Image: {request.prompt[:60]}", request.dict())
    background_tasks.add_task(_run_image_generation, job["id"], request)
    return {"job_id": job["id"], "status": "queued"}

# ─── Campaigns (FREE via Groq LLaMA 3 70B) ───────────────────────────────────

async def _run_campaign_generation(job_id: str, req: CampaignRequest):
    try:
        _update_job(job_id, status="running", started_at=datetime.utcnow().isoformat(),
                    progress=5, logs=["Starting campaign AI..."])

        sys_msg = "You are a world-class marketing strategist and copywriter. Be specific, creative, and action-oriented."

        # Step 1: Strategy
        _update_job(job_id, progress=15, logs=["Generating campaign strategy..."])
        strategy = await _llm(f"""Create a comprehensive marketing campaign for:

Product: {req.product_description}
Target Audience: {req.target_audience or 'General consumers'}
Budget: ${req.budget:,.0f}
Platforms: {', '.join(req.platforms)}
Goal: {req.campaign_goal}
Tone: {req.campaign_tone}
Competitor Info: {req.competitor_info or 'N/A'}

Include ALL of the following:
1. 🎯 CAMPAIGN NAME & TAGLINE
2. 💡 KEY MESSAGE (2-3 impactful sentences)
3. 📌 CONTENT PILLARS (3 pillars with descriptions)
4. 📱 PLATFORM STRATEGY (specific tactics per platform)
5. 💰 BUDGET ALLOCATION (% per platform with justification)
6. 📊 KPIs & SUCCESS METRICS
7. 📅 4-WEEK TIMELINE (week by week plan)
8. ✍️ 5 HEADLINE IDEAS
9. 🚀 CALL TO ACTION

Make it specific, creative, and ready to execute.""", system=sys_msg, max_tokens=2000)

        # Step 2: Social Posts
        _update_job(job_id, progress=50, logs=["Writing social media posts..."])
        social_posts = await _llm(f"""Write 5 engaging social media posts for {', '.join(req.platforms)}.

Product: {req.product_description}
Tone: {req.campaign_tone}
Target: {req.target_audience or 'General audience'}

For EACH post provide:
- Platform name
- Post text (engaging, platform-appropriate)
- 5-7 relevant hashtags
- 2-3 relevant emojis

Make each post unique in style and length. Mix short punchy with longer storytelling.""",
            system=sys_msg, max_tokens=1200)

        # Step 3: Email
        _update_job(job_id, progress=80, logs=["Writing email campaign..."])
        email = await _llm(f"""Write a complete high-converting marketing email.

Product: {req.product_description}
Audience: {req.target_audience or 'General consumers'}
Goal: {req.campaign_goal}
Tone: {req.campaign_tone}

Format exactly as:
Subject: [subject line — create urgency]
Preview Text: [90 char preview]

[Personalized greeting]

[Hook paragraph — grab attention in first 2 sentences]

[3 benefit paragraphs — features turned into customer benefits]

[Social proof line]

[Bold CTA button text]

[Warm sign-off]

P.S. [Compelling postscript]""", system=sys_msg, max_tokens=900)

        _update_job(job_id, status="completed", progress=100,
                    result={
                        "strategy": strategy,
                        "social_posts": social_posts,
                        "email": email,
                        "metadata": {
                            "product": req.product_description,
                            "audience": req.target_audience,
                            "budget": req.budget,
                            "platforms": req.platforms,
                            "goal": req.campaign_goal,
                            "created_at": datetime.utcnow().isoformat(),
                        }
                    },
                    completed_at=datetime.utcnow().isoformat(),
                    logs=["Campaign generated! ✅"])
    except Exception as e:
        logger.error(f"Campaign failed: {e}")
        _update_job(job_id, status="failed", error=str(e), completed_at=datetime.utcnow().isoformat())

@app.post("/api/campaigns/generate")
async def generate_campaign(request: CampaignRequest, background_tasks: BackgroundTasks):
    job = _new_job("campaign_generation", f"Campaign: {request.product_description[:60]}", request.dict())
    background_tasks.add_task(_run_campaign_generation, job["id"], request)
    return {"job_id": job["id"], "status": "queued"}

# ─── Content (FREE via Groq) ──────────────────────────────────────────────────

async def _run_content_generation(job_id: str, req: ContentRequest):
    try:
        _update_job(job_id, status="running", started_at=datetime.utcnow().isoformat(),
                    progress=10, logs=["Writing content..."])

        type_prompts = {
            "blog_post": f"""Write a professional, SEO-optimized blog post.
Topic: {req.topic}
Length: ~{req.word_count} words
Tone: {req.tone}
Audience: {req.target_audience or 'General readers'}
Keywords: {', '.join(req.keywords) if req.keywords else 'naturally relevant'}

Structure: Compelling H1, intro hook (2 para), 4-5 H2 sections with content, conclusion + CTA, meta description.""",

            "social_media": f"""Write 5 diverse social media posts about: {req.topic}
Tone: {req.tone}
Audience: {req.target_audience or 'General'}
Mix: 1 very short (<50 words), 2 medium, 2 long. Include emojis and hashtags. Each post different angle.""",

            "email": f"""Write a complete marketing email about: {req.topic}
Tone: {req.tone}
Format: Subject line | Preview text | [greeting → hook → 3 value sections → CTA → sign-off → PS]""",

            "ad_copy": f"""Write 5 ad copy variations for: {req.topic}
Tone: {req.tone}
Audience: {req.target_audience or 'General'}
Each: Headline (≤30 chars) | Long Headline (≤90 chars) | Description (≤90 chars) | CTA""",
        }

        prompt = type_prompts.get(req.content_type, type_prompts["blog_post"])
        _update_job(job_id, progress=40, logs=["AI writing..."])
        content = await _llm(prompt, system="You are an expert content writer and conversion copywriter.", max_tokens=2000)

        _update_job(job_id, status="completed", progress=100,
                    result={"content": content, "type": req.content_type, "topic": req.topic},
                    completed_at=datetime.utcnow().isoformat(), logs=["Content ready! ✅"])
    except Exception as e:
        logger.error(f"Content failed: {e}")
        _update_job(job_id, status="failed", error=str(e), completed_at=datetime.utcnow().isoformat())

@app.post("/api/content/generate")
async def generate_content(request: ContentRequest, background_tasks: BackgroundTasks):
    job = _new_job("content_generation", f"Content: {request.content_type} — {request.topic[:50]}", request.dict())
    background_tasks.add_task(_run_content_generation, job["id"], request)
    return {"job_id": job["id"], "status": "queued"}

# ─── Chat / Otto AI (FREE via Groq) ──────────────────────────────────────────

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        response = await _llm(
            message.message,
            system="""You are Otto, an expert AI business automation assistant for the Autonomous Business Platform.
You help with: marketing campaigns, product design, content writing, video production, business contacts, and automation.
Be concise, professional, and action-oriented. Give specific, practical advice.
When asked to write something, write it fully. Don't describe what you'd write — actually write it.""",
            max_tokens=700, temperature=0.75
        )
        return {"response": response, "conversation_id": message.conversation_id or str(uuid.uuid4())}
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ─── Video ───────────────────────────────────────────────────────────────────

async def _run_video_generation(job_id: str, req: VideoRequest):
    try:
        _update_job(job_id, status="running", started_at=datetime.utcnow().isoformat(),
                    progress=10, logs=["Checking video provider..."])
        token = os.getenv("REPLICATE_API_TOKEN", "")
        if not token.startswith("r8_"):
            raise ValueError(
                "Video generation needs Replicate credit ($5 min at replicate.com/account/billing). "
                "All other features work free with Groq."
            )
        import replicate
        client = replicate.Client(api_token=token)
        _update_job(job_id, progress=30, logs=["Generating video... (2-5 min)"])
        output = client.run(req.model, input={
            "prompt": req.prompt, "duration": req.duration, "aspect_ratio": req.aspect_ratio
        })
        video_url = str(output[0]) if isinstance(output, list) else str(output)
        _update_job(job_id, status="completed", progress=100,
                    result={"video_url": video_url},
                    completed_at=datetime.utcnow().isoformat(), logs=["Video ready! ✅"])
    except Exception as e:
        logger.error(f"Video failed: {e}")
        _update_job(job_id, status="failed", error=str(e), completed_at=datetime.utcnow().isoformat())

@app.post("/api/videos/generate")
async def generate_video(request: VideoRequest, background_tasks: BackgroundTasks):
    job = _new_job("video_generation", f"Video: {request.prompt[:60]}", request.dict())
    background_tasks.add_task(_run_video_generation, job["id"], request)
    return {"job_id": job["id"], "status": "queued"}

# ─── Contacts (FREE via Groq) ─────────────────────────────────────────────────

async def _run_contact_finder(job_id: str, req: ContactRequest):
    try:
        _update_job(job_id, status="running", started_at=datetime.utcnow().isoformat(),
                    progress=10, logs=["Finding contacts..."])

        prompt = f"""Generate {req.num_contacts} realistic business contacts for product outreach.

Product: {req.product_description}
Target Market: {req.target_market or 'auto-detect from product'}
Contact Types: {', '.join(req.contact_types)}

IMPORTANT: Return ONLY a valid JSON array. No text before or after. No markdown.

Each object must have exactly: name, role, company, channel, score, strategy, email

[
  {{
    "name": "Sarah Johnson",
    "role": "Lifestyle Influencer",
    "company": "SarahLives",
    "channel": "Instagram",
    "score": 9,
    "strategy": "Send product sample with a personalized video pitch",
    "email": "sarah@sarahlives.com"
  }}
]

Generate {req.num_contacts} contacts now. Return ONLY the JSON array:"""

        _update_job(job_id, progress=40, logs=["AI generating contact list..."])
        raw = await _llm(prompt, system="You are a business development expert. Return only valid JSON arrays, no other text.", max_tokens=3000, temperature=0.4)

        contacts = []
        try:
            json_match = re.search(r'\[[\s\S]*\]', raw)
            if json_match:
                contacts = json.loads(json_match.group())
        except Exception:
            contacts = []

        _update_job(job_id, status="completed", progress=100,
                    result={"contacts": contacts, "raw": raw, "count": len(contacts)},
                    completed_at=datetime.utcnow().isoformat(),
                    logs=[f"Found {len(contacts)} contacts! ✅"])
    except Exception as e:
        logger.error(f"Contacts failed: {e}")
        _update_job(job_id, status="failed", error=str(e), completed_at=datetime.utcnow().isoformat())

@app.post("/api/contacts/find")
async def find_contacts(request: ContactRequest, background_tasks: BackgroundTasks):
    job = _new_job("contact_finder", f"Find contacts: {request.product_description[:50]}", request.dict())
    background_tasks.add_task(_run_contact_finder, job["id"], request)
    return {"job_id": job["id"], "status": "queued"}

# ─── Database CRUD Endpoints ───────────────────────────────────────────────

# Customers
@app.get("/api/customers")
async def list_customers():
    return {"customers": db.get_all_customers()}

@app.post("/api/customers")
async def create_customer(customer: CustomerCreate):
    res = db.create_customer(customer.dict())
    return {"customer": res, "message": "Customer created successfully"}

@app.put("/api/customers/{customer_id}")
async def update_customer(customer_id: str, customer: CustomerUpdate):
    res = db.update_customer(customer_id, customer.dict(exclude_unset=True))
    if not res:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"customer": res, "message": "Customer updated"}

@app.delete("/api/customers/{customer_id}")
async def delete_customer(customer_id: str):
    success = db.delete_customer(customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted"}

# Contacts DB
@app.get("/api/contacts/db")
async def list_db_contacts():
    return {"contacts": db.get_all_contacts()}

@app.post("/api/contacts/db")
async def create_db_contact(contact: ContactCreate):
    res = db.create_contact(contact.dict())
    return {"contact": res, "message": "Contact saved"}

@app.post("/api/contacts/db/bulk")
async def bulk_create_db_contacts(contacts: List[ContactCreate]):
    saved = [db.create_contact(c.dict()) for c in contacts]
    return {"contacts": saved, "count": len(saved), "message": "Contacts saved"}

@app.put("/api/contacts/db/{contact_id}")
async def update_db_contact(contact_id: str, contact: ContactUpdate):
    res = db.update_contact(contact_id, contact.dict(exclude_unset=True))
    if not res:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"contact": res, "message": "Contact updated"}

@app.delete("/api/contacts/db/{contact_id}")
async def delete_db_contact(contact_id: str):
    success = db.delete_contact(contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted"}

# Products DB
@app.get("/api/products/db")
async def list_db_products():
    return {"products": db.get_all_products()}

@app.post("/api/products/db")
async def create_db_product(product: ProductCreate):
    res = db.create_product(product.dict())
    return {"product": res, "message": "Product saved"}

@app.put("/api/products/db/{product_id}")
async def update_db_product(product_id: str, product: ProductUpdate):
    res = db.update_product(product_id, product.dict(exclude_unset=True))
    if not res:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": res, "message": "Product updated"}

@app.delete("/api/products/db/{product_id}")
async def delete_db_product(product_id: str):
    success = db.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ─── Analytics ────────────────────────────────────────────────────────────────

@app.get("/api/analytics/overview")
async def get_analytics():
    def count(type_: str, status_: Optional[str] = None):
        return len([j for j in _jobs.values() if j["type"] == type_ and (status_ is None or j["status"] == status_)])
    return {
        "total_jobs": len(_jobs),
        "campaigns": {"total": count("campaign_generation"), "completed": count("campaign_generation", "completed")},
        "images": {"total": count("image_generation"), "completed": count("image_generation", "completed")},
        "videos": {"total": count("video_generation"), "completed": count("video_generation", "completed")},
        "content": {"total": count("content_generation"), "completed": count("content_generation", "completed")},
        "jobs_by_status": {
            s: len([j for j in _jobs.values() if j["status"] == s])
            for s in ["queued", "running", "completed", "failed", "cancelled"]
        },
    }

# ─── WebSocket ────────────────────────────────────────────────────────────────

@app.websocket("/ws/jobs/{job_id}")
async def ws_job_status(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        while True:
            if job_id in _jobs:
                job = _jobs[job_id]
                await websocket.send_json(job)
                if job["status"] in ("completed", "failed", "cancelled"):
                    break
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass

# ─── Entry ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api_server:app", host="0.0.0.0", port=port, reload=True)
