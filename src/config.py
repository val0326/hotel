from pydantic_settings import BaseSettings, SettingsConfigDict


TEST_USER_PAYLOAD = {
    "email": "Dallaso@mail.com",
    "password": "asdfg",
}
TEST_USER_PAYLOAD_2 = {
    "email": "Jumbo@mail.com",
    "password": "zxcv",
}


class Settings(BaseSettings):
    PROJECT_NAME: str
    VERSION: str
    DEBUG: bool
    CORS_ALLOWED_ORIGINS: str
    API_PREFIX: str
    DATABASE_URL: str
    URL_TEST_USER: str

    model_config = SettingsConfigDict(
        case_sensitive=False,
        env_file=".env",
        extra="allow",
    )


settings = Settings()
