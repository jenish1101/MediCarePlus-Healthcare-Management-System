try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated

from fastapi import Depends

from app.core.dependencies.auth import require_roles
from app.core.enums import AuditCategory, UserRole
from app.models.user import User
from app.services.audit import log_audit


class AuditLogger:
    def __init__(self, user: User) -> None:
        self._user = user

    async def log(
        self,
        *,
        action: str,
        target: str,
        category: AuditCategory = AuditCategory.USER,
    ) -> None:
        await log_audit(
            user_name=self._user.name,
            role=self._user.role,
            action=action,
            target=target,
            category=category,
        )


async def get_audit_logger(user: Annotated[User, Depends(require_roles(UserRole.ADMIN))]) -> AuditLogger:
    return AuditLogger(user)


AuditDep = Annotated[AuditLogger, Depends(get_audit_logger)]
