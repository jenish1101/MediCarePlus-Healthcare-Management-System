from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import get_settings
from app.models import DOCUMENT_MODELS

_client: AsyncIOMotorClient | None = None


def get_motor_client() -> AsyncIOMotorClient | None:
    return _client


async def connect_db() -> None:
    global _client
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(database=_client[settings.mongodb_db], document_models=DOCUMENT_MODELS)
    print(f"✔ MongoDB connected ({settings.mongodb_db})")


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
