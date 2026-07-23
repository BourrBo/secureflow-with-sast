from threading import Lock
from time import time


class ProgressService:
    def __init__(self):
        self._lock = Lock()
        self._progress = {}

    def start(self, scan_id: int):
        with self._lock:
            self._progress[scan_id] = {
                "scan_id": scan_id,
                "status": "running",
                "phase": "Initializing",
                "message": "Preparing scan...",
                "progress": 0,
                "elapsed": 0,
                "urls": 0,
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0,
                "started": time(),
            }

    def update(
        self,
        scan_id: int,
        *,
        phase=None,
        message=None,
        progress=None,
        urls=None,
        critical=None,
        high=None,
        medium=None,
        low=None,
    ):
        with self._lock:

            if scan_id not in self._progress:
                return

            data = self._progress[scan_id]

            if phase is not None:
                data["phase"] = phase

            if message is not None:
                data["message"] = message

            if progress is not None:
                data["progress"] = progress

            if urls is not None:
                data["urls"] = urls

            if critical is not None:
                data["critical"] = critical

            if high is not None:
                data["high"] = high

            if medium is not None:
                data["medium"] = medium

            if low is not None:
                data["low"] = low

            data["elapsed"] = int(time() - data["started"])

    def finish(self, scan_id: int):
        with self._lock:

            if scan_id not in self._progress:
                return

            self._progress[scan_id]["status"] = "completed"
            self._progress[scan_id]["progress"] = 100
            self._progress[scan_id]["phase"] = "Completed"
            self._progress[scan_id]["message"] = "Scan completed successfully."
            self._progress[scan_id]["elapsed"] = int(
                time() - self._progress[scan_id]["started"]
            )

    def fail(self, scan_id: int, message: str):
        with self._lock:

            if scan_id not in self._progress:
                return

            self._progress[scan_id]["status"] = "failed"
            self._progress[scan_id]["message"] = message
            self._progress[scan_id]["elapsed"] = int(
                time() - self._progress[scan_id]["started"]
            )

    def get(self, scan_id: int):
        with self._lock:
            return self._progress.get(scan_id)


progress_service = ProgressService()