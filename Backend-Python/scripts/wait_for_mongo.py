"""Wait until MongoDB accepts connections (used by Docker entrypoint)."""

import asyncio
import os
import sys

from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://mongo:27017")
MAX_ATTEMPTS = int(os.environ.get("MONGO_WAIT_ATTEMPTS", "30"))
DELAY_SECONDS = float(os.environ.get("MONGO_WAIT_DELAY", "1"))


async def wait_for_mongo() -> bool:
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
            await client.admin.command("ping")
            client.close()
            return True
        except Exception:
            if attempt < MAX_ATTEMPTS:
                await asyncio.sleep(DELAY_SECONDS)
    return False


if __name__ == "__main__":
    sys.exit(0 if asyncio.run(wait_for_mongo()) else 1)
