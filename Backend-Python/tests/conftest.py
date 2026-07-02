import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import close_db, connect_db
from app.main import app


@pytest.fixture
async def client():
    await connect_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    await close_db()
