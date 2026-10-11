/**
 * Builds the pre-filled email for committee attendance and membership requests.
 * The owner sends it from their own email account, so nothing is stored on the
 * website and delivery does not depend on the site's database or mail service.
 */

export const COMMITTEE_ADDRESS = "committee@james-square.com";

export type RequestEmailInput = {
  kind: "rsvp" | "membership";
  name: string;
  email: string;
  property: string;
  message: string;
  /** Human-readable meeting, e.g. "Monday 12 October 2026, 18:15". */
  meeting?: string;
  attendance?: "online" | "in-person" | "unsure" | "";
  whatsapp?: boolean;
  phone?: string;
};

const attendanceLabels = {
  online: "Online via Microsoft Teams",
  "in-person": "In person at the Conservatory",
  unsure: "Not sure yet",
} as const;

export type RequestEmail = { to: string; subject: string; body: string };

export function buildRequestEmail(input: RequestEmailInput): RequestEmail {
  const name = input.name.trim();
  const message = input.message.trim();
  const lines: string[] = ["Dear James Square Committee,", ""];
  let subject: string;

  if (input.kind === "rsvp") {
    subject = `Committee meeting attendance request – ${input.meeting ?? "next meeting"}`;
    lines.push(
      "I would like to attend the following committee meeting.",
      "",
      `Meeting: ${input.meeting ?? "Next meeting"}`,
      `Attending: ${attendanceLabels[input.attendance || "unsure"]}`,
    );
  } else {
    subject = "Committee membership enquiry";
    lines.push("I am interested in joining the James Square Owners Committee.", "");
    if (input.whatsapp)
      lines.push(
        `I would also like to be considered for the Committee WhatsApp group. My mobile / WhatsApp number is ${input.phone?.trim() || "(not given)"}.`,
      );
  }

  lines.push(
    "",
    `Name: ${name}`,
    `Flat / property: ${input.property.trim()}`,
    `Email: ${input.email.trim()}`,
  );
  if (message)
    lines.push(
      "",
      input.kind === "rsvp" ? "Points I would like to raise:" : "About my interest:",
      message,
    );
  lines.push("", "Kind regards,", name);

  return { to: COMMITTEE_ADDRESS, subject, body: lines.join("\n") };
}

/** Line endings as CRLF so every mail client keeps the line breaks. */
const crlf = (text: string) => text.replace(/\r?\n/g, "\r\n");

export function mailtoHref({ to, subject, body }: RequestEmail) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlf(body))}`;
}

/** Web compose links for owners whose device has no email app set up. */
export function gmailHref({ to, subject, body }: RequestEmail) {
  const q = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${q.toString()}`;
}

export function outlookHref({ to, subject, body }: RequestEmail) {
  const q = new URLSearchParams({ to, subject, body });
  return `https://outlook.live.com/mail/0/deeplink/compose?${q.toString()}`;
}

/** Plain text for the "Copy" button, for owners who prefer to paste it in. */
export function plainTextEmail({ to, subject, body }: RequestEmail) {
  return `To: ${to}\nSubject: ${subject}\n\n${body}`;
}
