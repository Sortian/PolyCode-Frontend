import { getApiBase } from "../../../config/apiBase";

function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function postAssistantChat({
  message,
  history,
  session_id,
  context,
  level,
  assistant_message_id,
}) {
  const url = `${getApiBase()}/chat/assistant`;

  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message,
      history,
      session_id,
      context: context || {},
      level,
      assistant_message_id,
    }),
  });

  if (res.status === 429) {
    throw new Error(
      "Too many messages. Please wait a moment before trying again.",
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = await res.json();
      detail = errBody.error || errBody.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error("Assistant did not return a successful response.");
  }
  return data;
}

export async function fetchAssistantSession(sessionId) {
  const url = `${getApiBase()}/chat/assistant/session/${encodeURIComponent(sessionId)}`;

  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (res.status === 403) {
      return { forbidden: true };
    }

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    // Backend offline, CORS, or network issue — fall back to local session
    return null;
  }
}

export async function postAssistantFeedback({
  session_id,
  message_id,
  rating,
  user_message,
  assistant_message,
  context,
}) {
  const url = `${getApiBase()}/chat/assistant/feedback`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        session_id,
        message_id,
        rating,
        user_message,
        assistant_message,
        context: context || {},
      }),
    });

    if (!res.ok) {
      let detail = res.statusText;
      try {
        const errBody = await res.json();
        detail = errBody.error || detail;
      } catch {
        /* ignore */
      }
      throw new Error(detail || `Feedback failed (${res.status})`);
    }

    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Could not save feedback.");
  }
}

export async function clearAssistantSession(sessionId) {
  const url = `${getApiBase()}/chat/assistant/session/${encodeURIComponent(sessionId)}`;

  try {
    await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch {
    /* ignore when backend is unreachable */
  }
}
