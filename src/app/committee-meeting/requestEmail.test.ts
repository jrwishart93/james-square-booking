import { describe, expect, it } from "vitest";
import {
  buildRequestEmail,
  gmailHref,
  mailtoHref,
  outlookHref,
} from "./requestEmail";

const rsvp = buildRequestEmail({
  kind: "rsvp",
  name: " Jane Owner ",
  email: "jane@example.com",
  property: "Flat 3, 57 Caledonian Crescent",
  message: "Pool update & costs?",
  meeting: "Monday 12 October 2026, 18:15",
  attendance: "online",
});

describe("committee request email", () => {
  it("addresses the committee and fills in the owner's details", () => {
    expect(rsvp.to).toBe("committee@james-square.com");
    expect(rsvp.subject).toBe(
      "Committee meeting attendance request – Monday 12 October 2026, 18:15",
    );
    expect(rsvp.body).toContain("Meeting: Monday 12 October 2026, 18:15");
    expect(rsvp.body).toContain("Attending: Online via Microsoft Teams");
    expect(rsvp.body).toContain("Name: Jane Owner");
    expect(rsvp.body).toContain("Flat / property: Flat 3, 57 Caledonian Crescent");
    expect(rsvp.body).toContain("Email: jane@example.com");
    expect(rsvp.body).toContain("Points I would like to raise:\nPool update & costs?");
  });

  it("leaves the optional message section out when empty", () => {
    const email = buildRequestEmail({
      kind: "rsvp",
      name: "A",
      email: "a@example.com",
      property: "Flat 1",
      message: "  ",
    });
    expect(email.body).not.toContain("Points I would like to raise");
    expect(email.body).toContain("Attending: Not sure yet");
  });

  it("includes the WhatsApp number on membership enquiries when asked", () => {
    const email = buildRequestEmail({
      kind: "membership",
      name: "B",
      email: "b@example.com",
      property: "Flat 2",
      message: "",
      whatsapp: true,
      phone: "+44 7700 900000",
    });
    expect(email.subject).toBe("Committee membership enquiry");
    expect(email.body).toContain("+44 7700 900000");
  });

  it("encodes special characters so the link survives intact", () => {
    const href = mailtoHref(rsvp);
    expect(href.startsWith("mailto:committee@james-square.com?subject=")).toBe(true);
    expect(href).not.toContain(" ");
    expect(href).toContain("%26"); // the "&" in the message
    expect(href).toContain("%0D%0A"); // line breaks as CRLF
    const body = decodeURIComponent(href.split("&body=")[1]);
    expect(body.replace(/\r\n/g, "\n")).toBe(rsvp.body);
  });

  it("builds Gmail and Outlook compose links with the same content", () => {
    const gmail = new URL(gmailHref(rsvp));
    expect(gmail.searchParams.get("to")).toBe(rsvp.to);
    expect(gmail.searchParams.get("su")).toBe(rsvp.subject);
    expect(gmail.searchParams.get("body")).toBe(rsvp.body);
    const outlook = new URL(outlookHref(rsvp));
    expect(outlook.searchParams.get("subject")).toBe(rsvp.subject);
    expect(outlook.searchParams.get("body")).toBe(rsvp.body);
  });
});
