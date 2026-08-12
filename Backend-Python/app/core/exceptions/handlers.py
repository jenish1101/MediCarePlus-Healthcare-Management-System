from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions.base import AppError


async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    body: dict[str, Any] = {"error": exc.message}
    if exc.details is not None:
        body["details"] = exc.details
    return JSONResponse(status_code=exc.status_code, content=body)


async def unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc) if exc else "Unknown error"},
    )


def register_exception_handlers(app: FastAPI, *, debug: bool = False) -> None:
    app.add_exception_handler(AppError, app_error_handler)
    if not debug:
        app.add_exception_handler(Exception, unhandled_error_handler)
