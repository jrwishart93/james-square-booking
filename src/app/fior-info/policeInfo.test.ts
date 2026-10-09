import { describe, expect, it } from "vitest";
import { buildMailtoUri } from "./repaymentEmail";
import * as policeInfo from "./policeInfo";
import {
  EMPTY_POLICE_DETAILS,
  buildPoliceBody,
  COMMITTEE_EMAIL,
  MYRESIDE_REFERENCE_EMAIL,
  POLICE_INCIDENT_NUMBER,
  POLICE_SUMMARY_SUBJECT,
  REFERENCE_REQUEST_BODY,
  REFERENCE_REQUEST_SUBJECT,
  joinDocuments,
  validatePoliceDetails,
  type PoliceDetails,
} from "./policeInfo";

const details: PoliceDetails = {
  ...EMPTY_POLICE_DETAILS,
  fullName: "Jane Owner",
  address: "1/2 James Square",
  contact: "jane@example.com",
  payment: "Roof repair contribution",
  amount: "1,250",
  paymentDate: "March 2025",
  toldFor: "Proposed roof works",
  afterwards: "The works were not carried out.",
  repaymentRequested: "yes",
  repaymentWhen: "April 2026",
  moneyReturned: "no",
  whyRelevant: "The circumstances appear similar to those reported by other owners.",
};

describe("police configuration", () => {
  it("publishes the incident number but no officer name or enquiry reference", () => {
    expect(POLICE_INCIDENT_NUMBER).toBe("PS-20260720-1008");
    const published = JSON.stringify(policeInfo) + REFERENCE_REQUEST_BODY + REFERENCE_REQUEST_SUBJECT;
    expect(published).not.toMatch(/Webster|DC\s|EN\/\d/);
    expect(published).not.toMatch(/@scotland\.police\.uk/);
    expect(REFERENCE_REQUEST_BODY).toContain("in addition to incident number PS-20260720-1008");
  });

  it("directs reference requests to the committee and Myreside", () => {
    expect(COMMITTEE_EMAIL).toBe("committee@james-square.com");
    expect(MYRESIDE_REFERENCE_EMAIL).toBe("ania@myreside-management.co.uk");
    const uri = buildMailtoUri(COMMITTEE_EMAIL, REFERENCE_REQUEST_SUBJECT, REFERENCE_REQUEST_BODY, [MYRESIDE_REFERENCE_EMAIL]);
    const url = new URL(uri);
    expect(url.pathname).toBe(COMMITTEE_EMAIL);
    expect(url.searchParams.get("cc")).toBe(MYRESIDE_REFERENCE_EMAIL);
    expect(url.searchParams.get("subject")).toBe(REFERENCE_REQUEST_SUBJECT);
  });
});

describe("validatePoliceDetails", () => {
  it("requires only identity and contact details", () => {
    expect(Object.keys(validatePoliceDetails(EMPTY_POLICE_DETAILS)).sort()).toEqual(["address", "contact", "fullName"]);
    expect(validatePoliceDetails(details)).toEqual({});
  });

  it("rejects malformed amounts", () => {
    expect(validatePoliceDetails({ ...details, amount: "12.345" }).amount).toBeDefined();
  });
});

describe("buildPoliceBody", () => {
  const body = buildPoliceBody(details, ["bank statements showing payment", "FIOR invoices"]);

  it("includes the owner's facts without naming an officer or reference", () => {
    expect(body.startsWith("Dear Officer,")).toBe(true);
    expect(body).toContain("Amount paid: £1,250.00");
    expect(body).toContain("Yes – April 2026");
    expect(body).toContain("including bank statements showing payment and FIOR invoices,");
    expect(body).toContain("incident number I have been given for this matter is PS-20260720-1008.");
    expect(body).not.toMatch(/EN\/|Webster/);
    expect(body).not.toMatch(/making enquiries|ongoing|investigat/i);
  });

  it("never generates criminal allegations", () => {
    const generated = (buildPoliceBody(EMPTY_POLICE_DETAILS, []) + POLICE_SUMMARY_SUBJECT).toLowerCase();
    for (const word of ["fraud", "stole", "stolen", "embezzl", "theft", "offence", "criminal", "guilty"]) {
      expect(generated).not.toContain(word);
    }
  });

  it("leaves out questions the owner did not answer", () => {
    const minimal = buildPoliceBody({ ...EMPTY_POLICE_DETAILS, fullName: "Jane", address: "1 James Square", contact: "x" }, []);
    expect(minimal).not.toContain("Amount paid");
    expect(minimal).not.toContain("Purpose of payment");
    expect(minimal).toContain("James Square property: 1 James Square");
  });
});

describe("joinDocuments", () => {
  it("joins naturally", () => {
    expect(joinDocuments(["a", "b", "c"])).toBe("a, b and c");
    expect(joinDocuments(["a"])).toBe("a");
    expect(joinDocuments([])).toBe("");
  });
});
