import { User } from "firebase/auth";

type RecipientMode = "all" | "owners" | "selected";

export async function sendAdminEmailRequest(
  user: User,
  payload: {
    subject: string;
    message: string;
    recipients: {
      mode: RecipientMode;
      userIds?: string[];
    };
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
