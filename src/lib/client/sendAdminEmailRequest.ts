import { User } from "firebase/auth";

type RecipientMode = "all" | "owners" | "selected";

export async function sendAdminEmailRequest(
  user: User,
  payload: {
    subject: string;
    message: string;
    sender: string;
    recipients: {
      mode: RecipientMode;
      userIds?: string[];
      emails?: string[];
    };
  },
) {
  const token = await user.getIdToken();

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
