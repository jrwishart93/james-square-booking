type CommitteeEmailPayload = {
  subject: string;
  message: string;
  recipients: string[];
};

export async function sendCommitteeEmailRequest(
  payload: CommitteeEmailPayload,
  token?: string,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch("/api/committee/send-email", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Failed with ${res.status}`);
  return json;
}
