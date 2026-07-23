const BACKEND_URL = "http://127.0.0.1:8000";

export type DastFinding = {
  title: string;
  severity: string;
  description: string;
  rule: string;
  cwe: string;
  owasp: string;
  scanner: string;
  installed_version?: string;
  fixed_version?: string;
  ecosystem?: string;
  iso27001_control?: string;
  iso27001_control_name?: string;
  iso27001_description?: string;
  file?: string;
  line?: number;
  url?: string;
  parameter?: string;
  evidence?: string;
  cvss?: number | null;
};

export type DastStartResponse = {
  scan_id: number;
  status: string;
};

export type DastProgress = {
  phase: string;
  message: string;
  progress: number;
  status: string;
  elapsed?: number;
};

export async function startDastScan(
  targetUrl: string
): Promise<DastStartResponse> {
  const response = await fetch(
    `${BACKEND_URL}/api/dast/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_url: targetUrl,
        mode: "quick",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

export async function getDastProgress(
  scanId: number
): Promise<DastProgress> {
  const response = await fetch(
    `${BACKEND_URL}/api/progress/${scanId}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

export async function getDastResults(
  scanId: number
): Promise<DastFinding[]> {
  const response = await fetch(
    `${BACKEND_URL}/api/dast/results/${scanId}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

/*
Temporary compatibility function.
This will be removed after the dashboard
is migrated to the new async workflow.
*/
export async function scanDast(
  targetUrl: string
): Promise<DastFinding[]> {
  const response = await fetch(
    `${BACKEND_URL}/api/dast/scan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_url: targetUrl,
        mode: "full",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}