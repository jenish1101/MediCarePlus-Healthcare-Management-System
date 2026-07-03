from dataclasses import dataclass

try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated

from fastapi import Depends, Query


@dataclass
class PaginationParams:
    skip: int
    limit: int


def pagination_params(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
) -> PaginationParams:
    return PaginationParams(skip=skip, limit=limit)


Pagination = Annotated[PaginationParams, Depends(pagination_params)]
