from typing import Any, Optional


class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400, details: Optional[Any] = None) -> None:
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)
