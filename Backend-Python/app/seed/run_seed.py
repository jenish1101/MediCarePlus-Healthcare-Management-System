"""Run database seed manually: python -m app.seed.run_seed"""

import asyncio

from app.core.database import close_db, connect_db
from app.seed.extra_dummy_data import seed_extra_dummy_data
from app.seed.seed_data import seed_database


async def main() -> None:
    await connect_db()
    print("▸ Running core seed...")
    await seed_database()
    print("▸ Running extra dummy data seed...")
    stats = await seed_extra_dummy_data()
    total = sum(stats.values())
    print("")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  Seed complete")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    for key, count in stats.items():
        if count:
            print(f"  + {count} new {key.replace('_', ' ')}")
    if total == 0:
        print("  (all dummy data already exists — nothing new added)")
    else:
        print(f"  Total new records: {total}")
    print("  Database: medicare_plus")
    print("  Refresh MongoDB Atlas Data Explorer to see updates")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    await close_db()


if __name__ == "__main__":
    asyncio.run(main())
