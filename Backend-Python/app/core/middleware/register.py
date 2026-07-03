from fastapi import FastAPI
from starlette.requests import Request

from app.core.middleware.logging import logging_middleware
from app.core.middleware.request_id import CallNext, request_id_middleware
from app.core.middleware.security_headers import security_headers_middleware


def register_middleware(app: FastAPI) -> None:
    """Register HTTP middleware via @app.middleware('http') decorators.

    First registered = innermost (closest to route).
    Last registered = outermost (first to receive the request).
    Order: CORS (add_middleware) -> request_id -> logging -> security_headers -> route
    """

    @app.middleware("http")
    async def _security_headers(request: Request, call_next: CallNext):
        return await security_headers_middleware(request, call_next)

    @app.middleware("http")
    async def _logging(request: Request, call_next: CallNext):
        return await logging_middleware(request, call_next)

    @app.middleware("http")
    async def _request_id(request: Request, call_next: CallNext):
        return await request_id_middleware(request, call_next)
