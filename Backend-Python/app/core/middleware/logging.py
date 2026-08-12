import logging
import time

from starlette.requests import Request
from starlette.responses import Response

from app.core.middleware.request_id import CallNext

logger = logging.getLogger("medicare.api")


async def logging_middleware(request: Request, call_next: CallNext) -> Response:
    start = time.perf_counter()
    request_id = getattr(request.state, "request_id", "-")
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s %s %.1fms request_id=%s",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
        request_id,
    )
    return response
