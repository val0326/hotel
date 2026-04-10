from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Определяем путь к корню проекта (на два уровня выше config.py)
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str
    VERSION: str
    DEBUG: bool
    CORS_ALLOWED_ORIGINS: str
    API_PREFIX: str
    DATABASE_URL: str
    URL_TEST_USER: str
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 часа

    model_config = SettingsConfigDict(
        case_sensitive=False,
        env_file=str(ENV_FILE),
        extra="allow",
    )


settings = Settings()

# Test fixtures constants
TEST_USER_PAYLOAD = {
    "email": "test@example.com",
    "password": "string123",
}

TEST_USER_PAYLOAD_2 = {
    "email": "test2@example.com",
    "password": "string456",
}
