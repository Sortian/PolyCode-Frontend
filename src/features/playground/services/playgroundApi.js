import { getApiBase } from "../../../config/apiBase";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function readResponse(res, fallbackMessage) {
  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }
  return data;
}

export async function fetchPlaygroundFiles(token, language) {
  const url = `${getApiBase()}/playground/files?language=${encodeURIComponent(language)}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  return readResponse(res, "Could not load playground files");
}

export async function createPlaygroundFile(token, { language, name, content }) {
  const res = await fetch(`${getApiBase()}/playground/files`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ language, name, content }),
  });
  return readResponse(res, "Could not create file");
}

export async function updatePlaygroundFile(token, fileId, { name, content }) {
  const res = await fetch(`${getApiBase()}/playground/files/${encodeURIComponent(fileId)}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ name, content }),
  });
  return readResponse(res, "Could not save file");
}

export async function deletePlaygroundFile(token, fileId) {
  const res = await fetch(`${getApiBase()}/playground/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return readResponse(res, "Could not delete file");
}

export async function savePlaygroundRun(token, payload) {
  const res = await fetch(`${getApiBase()}/playground/runs`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return readResponse(res, "Could not save run output");
}
