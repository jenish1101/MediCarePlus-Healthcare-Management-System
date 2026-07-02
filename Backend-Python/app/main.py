from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.database import close_db, connect_db, get_motor_client
from app.seed.seed_data import seed_database


def _startup_banner(public_url: str) -> None:
    print("")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  MediCare Plus API — ready")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  ✔ MongoDB connected")
    print("  ✔ Demo data seeded (if enabled)")
    print(f"  ✔ Uvicorn running on {public_url}")
    print(f"  → Docs:   {public_url}/docs")
    print(f"  → Health: {public_url}/health")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("")


@asynccontextmanager
async def lifespan(_: FastAPI):
    import os

    settings = get_settings()
    try:
        await connect_db()
        if settings.seed_database:
            await seed_database()
    except Exception as exc:
        print("")
        print("✖ MongoDB not connected — API startup failed")
        print(f"  {exc}")
        print("")
        raise
    public_url = os.environ.get("API_PUBLIC_URL", "http://localhost:8001")
    _startup_banner(public_url)
    yield
    await close_db()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", tags=["Health"])
    async def root() -> dict:
        return {
            "service": settings.app_name,
            "status": "ok",
            "docs": "/docs",
            "health": "/health",
            "api": settings.api_v1_prefix,
        }

    @app.get("/health", tags=["Health"])
    async def health() -> dict:
        return {"status": "ok", "service": settings.app_name}

    @app.get("/ready", tags=["Health"])
    async def ready() -> dict:
        client = get_motor_client()
        if client is None:
            raise HTTPException(status_code=503, detail="Database not connected")
        try:
            await client.admin.command("ping")
        except Exception as exc:
            raise HTTPException(status_code=503, detail="MongoDB not connected") from exc
        return {"status": "ready", "database": "connected"}

    return app


app = create_app()
