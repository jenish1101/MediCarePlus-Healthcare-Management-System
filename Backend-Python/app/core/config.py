from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.mongo import parse_db_name_from_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "MediCare Plus API"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    mongodb_url: str = "mongodb://localhost:27017/medicare_plus"

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    cors_origins: str = "http://localhost:3000"

    seed_database: bool = True

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, value: str | List[str]) -> str:
        if isinstance(value, list):
            return ",".join(value)
        return value

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def mongodb_db(self) -> str:
        return parse_db_name_from_url(self.mongodb_url)


@lru_cache
def get_settings() -> Settings:
    return Settings()
