from typing import TypeVar

from beanie import Document, PydanticObjectId

from app.core.exceptions import ForbiddenError, NotFoundError

T = TypeVar("T", bound=Document)


async def get_or_404(model: type[T], doc_id: PydanticObjectId, detail: str = "Not found") -> T:
  doc = await model.get(doc_id)
  if doc is None:
    raise NotFoundError(detail)
  return doc


def ensure_owner(resource_owner_id: PydanticObjectId, current_user_id: PydanticObjectId, detail: str = "Forbidden") -> None:
  if resource_owner_id != current_user_id:
    raise ForbiddenError(detail)
