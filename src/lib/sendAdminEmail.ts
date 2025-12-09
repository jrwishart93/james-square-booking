import { User } from 'firebase/auth';

interface Payload {
  to: string[];
  subject: string;
  bodyHtml: string;
}

export async function sendAdminEmail(user: User, payload: Payload) {
  const token = await user.getIdToken();

  const response = await fetch('/api/admin/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.error || `Failed with ${response.status}`);
  }

  return json;
}
