from starlette.requests import Request
from starlette.responses import Response

from app.core.middleware.request_id import CallNext


async def security_headers_middleware(request: Request, call_next: CallNext) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response
