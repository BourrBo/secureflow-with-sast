import os
import socket
import subprocess
import time

from config.settings import settings


class ZapManager:
    """
    Automatically starts OWASP ZAP Daemon if it is not already running.
    """

    def __init__(self):
        self.process = None

    def is_running(self) -> bool:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)

            return (
                sock.connect_ex(
                    (
                        "127.0.0.1",
                        settings.ZAP_PORT,
                    )
                )
                == 0
            )

    def start(self):
        """
        Starts ZAP daemon automatically.
        """
        print(">>> ZapManager.start() called")

        running = self.is_running()
        print("Already running:", running)

        if running:
          return

        backend_root = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
   )

        project_root = os.path.dirname(backend_root)

        zap_bat = os.path.join(
    project_root,
    "DAST",
    "ZAP_2.17.0",
    "zap.bat",
)
        print("ZAP Path:", zap_bat)
        print("Exists:", os.path.exists(zap_bat))

        if not os.path.exists(zap_bat):
            raise RuntimeError(
                f"Unable to locate ZAP:\n{zap_bat}"
            )

        self.process = subprocess.Popen(
    [
        zap_bat,
        "-daemon",
        "-host",
        "127.0.0.1",
        "-port",
        str(settings.ZAP_PORT),
    ],
    cwd=os.path.dirname(zap_bat),
)

        timeout = time.time() + 30

        while time.time() < timeout:

            if self.is_running():
                return

            time.sleep(1)

        raise RuntimeError(
            "Timed out waiting for OWASP ZAP daemon to start."
        )

    def stop(self):
        """
        Stop ZAP if SecureFlow started it.
        """

        if self.process:

            self.process.terminate()

            self.process.wait(timeout=10)

            self.process = None


zap_manager = ZapManager()