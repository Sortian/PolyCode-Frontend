const LOCAL_ASSISTANT_API = "http://127.0.0.1:8001";

function normalizeBase(url = "") {
  return url.trim().replace(/\/$/, "");
}

export function getAssistantApiBase() {
  const envUrl = normalizeBase(process.env.REACT_APP_ASSISTANT_API_URL || "");

  if (typeof window === "undefined") {
    return envUrl || LOCAL_ASSISTANT_API;
  }

  if (envUrl) {
    return envUrl;
  }

  return LOCAL_ASSISTANT_API;
}
