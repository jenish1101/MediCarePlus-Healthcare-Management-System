from typing import Any, Optional

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
  def __init__(self, message: str, status_code: int = 400, details: Optional[Any] = None) -> None:
    self.message = message
    self.status_code = status_code
    self.details = details
    super().__init__(message)


class NotFoundError(AppError):
  def __init__(self, message: str = "Resource not found", details: Optional[Any] = None) -> None:
    super().__init__(message=message, status_code=404, details=details)


class ForbiddenError(AppError):
  def __init__(self, message: str = "Forbidden", details: Optional[Any] = None) -> None:
    super().__init__(message=message, status_code=403, details=details)


class UnauthorizedError(AppError):
  def __init__(self, message: str = "Unauthorized", details: Optional[Any] = None) -> None:
    super().__init__(message=message, status_code=401, details=details)


class ConflictError(AppError):
  def __init__(self, message: str = "Conflict", details: Optional[Any] = None) -> None:
    super().__init__(message=message, status_code=409, details=details)


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
