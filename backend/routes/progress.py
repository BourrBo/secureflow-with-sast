from fastapi import APIRouter, HTTPException

from services.progress_service import progress_service

router = APIRouter()


@router.get("/api/progress/{scan_id}")
def get_progress(scan_id: int):

    progress = progress_service.get(scan_id)

    if progress is None:
        raise HTTPException(
            status_code=404,
            detail="Scan progress not found.",
        )

    return progress