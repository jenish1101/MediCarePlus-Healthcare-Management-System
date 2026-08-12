from typing import Any, Optional

from app.core.exceptions.base import AppError


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


class BadRequestError(AppError):
    def __init__(self, message: str = "Bad request", details: Optional[Any] = None) -> None:
        super().__init__(message=message, status_code=400, details=details)
