import { getAssistantApiBase } from "../../../config/assistantApiBase";

export async function postAssistantChat(body) {
  const url = `${getAssistantApiBase()}/public/assistant/chat`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    throw new Error("Too many messages. Please wait a moment before trying again.");
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = await res.json();
      if (typeof errBody.detail === "string") {
        detail = errBody.detail;
      }
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
