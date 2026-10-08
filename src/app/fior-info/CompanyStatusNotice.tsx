import { Building2 } from "lucide-react";
import { COMPANY_STATUS_CHECK, FIOR_COMPANY, type CompanyStatusCheck } from "./claimPrepSources";
import { ExternalLink, Notice } from "./ui";

// Factual, dated notice about FIOR's Companies House status. It only states a
// status that a person has checked against the live register (see
// COMPANY_STATUS_CHECK); otherwise it simply points owners to the register.

export default function CompanyStatusNotice({
  check = COMPANY_STATUS_CHECK,
  className = "",
}: {
  check?: CompanyStatusCheck | null;
  className?: string;
}) {
  const company = `${FIOR_COMPANY.legalName} (company number ${FIOR_COMPANY.companyNumber})`;
  return (
    <Notice
      className={className}
      tone={check?.strikeOffProposed ? "warning" : "info"}
      icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
      title={check?.strikeOffProposed ? "Companies House: proposal to strike off" : "Companies House status"}
    >
      {check ? (
        <p>
          On {check.checkedOn}, the Companies House record for {company} showed its status as “{check.status}”. The
          status may have changed since then, so please check the live record.
        </p>
      ) : (
        <p>
          Before deciding what to do, you may wish to check the current status of {company} on the official Companies
          House register.
        </p>
      )}
      {check?.strikeOffProposed && (
        <p>
          A proposal to strike off means Companies House has published notice that the company may be removed from the
          register. It does not in itself mean that the company will be dissolved, and the action can be suspended or
          discontinued.
        </p>
      )}
      <p>
        If a company is dissolved, it generally ceases to exist as a legal entity. A claim cannot normally be raised or
        continued against a dissolved company unless it is first restored to the register, which is a separate legal
        process. Owners who believe they are owed money may wish to seek independent legal advice promptly, as
        dissolution could affect their recovery options.
      </p>
      <p>
        GOV.UK explains when and how a person, including someone who believes a company owes them money, can object to
        a company being struck off. Whether to do so is a matter for each owner.
      </p>
      <p className="flex flex-wrap gap-x-6 gap-y-2">
        <ExternalLink href={FIOR_COMPANY.companiesHouseUrl}>Companies House record</ExternalLink>
        <ExternalLink href={FIOR_COMPANY.filingHistoryUrl}>Filing history</ExternalLink>
        <ExternalLink href={FIOR_COMPANY.strikeOffObjectionUrl}>Objecting to a strike-off (GOV.UK)</ExternalLink>
      </p>
    </Notice>
  );
}
