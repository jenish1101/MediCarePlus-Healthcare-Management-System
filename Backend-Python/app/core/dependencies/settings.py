try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated

from fastapi import Depends

from app.core.config import Settings, get_settings


def get_settings_dep() -> Settings:
    return get_settings()


SettingsDep = Annotated[Settings, Depends(get_settings_dep)]
