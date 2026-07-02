import re
from urllib.parse import unquote

_DB_NAME_PATTERN = re.compile(r"mongodb(?:\+srv)?://[^/]+/([^/?]+)")


def parse_db_name_from_url(url: str, fallback: str = "medicare_plus") -> str:
    """Database name from the connection URL path (e.g. .../medicare_plus?...)."""
    match = _DB_NAME_PATTERN.search(url)
    return unquote(match.group(1)) if match else fallback
