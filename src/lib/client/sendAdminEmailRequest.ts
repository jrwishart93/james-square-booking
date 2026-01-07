import { User } from "firebase/auth";

type AttachmentPayload = { filename: string; content: string };

export async function sendAdminEmailRequest(
  user: User,
  payload: {
    to: string | string[];
    subject: string;
    message: string;
    attachments?: AttachmentPayload[];
  },
) {
  const token = await user.getIdToken(true);

  const res = await fetch("/api/admin/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Failed with ${res.status}`);
  return json;
}
