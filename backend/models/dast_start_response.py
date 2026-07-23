from pydantic import BaseModel


class DastStartResponse(BaseModel):
    scan_id: int
    status: str