from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Global SecureFlow configuration.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    # -------------------------------------------------
    # ZAP
    # -------------------------------------------------

    ZAP_HOME: str = str(
        Path(__file__).resolve().parents[2]
        / "DAST"
        / "ZAP_2.17.0"
    )

    # ZAP Desktop default port
    ZAP_PORT: int = 8090

    MAX_SPIDER_MINUTES: int = 5
    MAX_ACTIVE_SCAN_MINUTES: int = 15


settings = Settings()