import { describe, expect, it } from "vitest";
import { buildMailtoUri } from "./repaymentEmail";
import {
  EMPTY_POLICE_DETAILS,
  buildPoliceBody,
  joinDocuments,
  policeSubject,
  resolvePoliceContact,
  resolvePoliceReference,
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

const reference = resolvePoliceReference(undefined);
const contact = resolvePoliceContact(undefined);

describe("police configuration", () => {
  it("does not invent an email address for the enquiry officer", () => {
    expect(contact.officer).toBe("DC Holly Webster");
    expect(contact.email).toBeNull();
  });

  it("only accepts a Police Scotland address", () => {
    expect(resolvePoliceContact("officer@scotland.police.uk").email).toBe("officer@scotland.police.uk");
    expect(resolvePoliceContact(" officer@example.com ").email).toBeNull();
    expect(resolvePoliceContact("officer@scotland.police.uk.evil.com").email).toBeNull();
  });

  it("shows the reference unless explicitly hidden", () => {
    expect(reference).toEqual({ reference: "EN/0016676/26", visible: true });
    expect(resolvePoliceReference("false").visible).toBe(false);
    expect(policeSubject(resolvePoliceReference("false"))).not.toContain("EN/");
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
  const body = buildPoliceBody(details, ["bank statements showing payment", "FIOR invoices"], contact, reference);

  it("includes the owner's facts and the reference", () => {
    expect(body).toContain("Dear DC Webster,");
    expect(body).toContain("Amount paid: £1,250.00");
    expect(body).toContain("Yes – April 2026");
    expect(body).toContain("including bank statements showing payment and FIOR invoices,");
    expect(body).toContain("enquiry reference I have been provided with is EN/0016676/26");
  });

  it("never generates criminal allegations", () => {
    const generated = buildPoliceBody(EMPTY_POLICE_DETAILS, [], contact, reference).toLowerCase();
    for (const word of ["fraud", "stole", "stolen", "embezzl", "theft", "offence", "criminal", "guilty"]) {
      expect(generated).not.toContain(word);
    }
  });

  it("leaves out questions the owner did not answer", () => {
    const minimal = buildPoliceBody({ ...EMPTY_POLICE_DETAILS, fullName: "Jane", address: "1 James Square", contact: "x" }, [], contact, reference);
    expect(minimal).not.toContain("Amount paid");
    expect(minimal).not.toContain("Purpose of payment");
    expect(minimal).toContain("James Square property: 1 James Square");
  });

  it("omits the reference when hidden", () => {
    expect(buildPoliceBody(details, [], contact, resolvePoliceReference("false"))).not.toContain("EN/0016676/26");
  });

  it("encodes safely into a mailto link", () => {
    const uri = buildMailtoUri("officer@scotland.police.uk", policeSubject(reference), body);
    expect(uri).toContain("EN%2F0016676%2F26");
    expect(uri).toContain("%C2%A31%2C250.00");
    expect(uri).not.toMatch(/[\s£]/);
  });
});

describe("joinDocuments", () => {
  it("joins naturally", () => {
    expect(joinDocuments(["a", "b", "c"])).toBe("a, b and c");
    expect(joinDocuments(["a"])).toBe("a");
    expect(joinDocuments([])).toBe("");
  });
});
