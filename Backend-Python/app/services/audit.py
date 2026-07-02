from app.core.enums import AuditCategory
from app.models.admin import AuditLogEntry


async def log_audit(
    *,
    user_name: str,
    role: str,
    action: str,
    target: str,
    category: AuditCategory = AuditCategory.USER,
) -> None:
    await AuditLogEntry(
        user_name=user_name,
        role=role,
        action=action,
        target=target,
        category=category,
    ).insert()
