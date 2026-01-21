import type { Metadata } from 'next';

import FactorInfoPage from '@/components/FactorInfoPage';
import TimedVimeoEmbed from '@/components/TimedVimeoEmbed';
import VotingCallout from '@/components/VotingCallout';

export const metadata: Metadata = {
  title: 'Newton Property Management | James Square',
  description: 'Information for James Square owners about Newton Property Management factoring proposal.',
};

const PRESENTATION_EXPIRY = '2026-01-23T17:00:00+00:00';

const NewtonPage = () => {
  return (
    <FactorInfoPage
      title="Newton Property Management"
      subtitle="Information for James Square owners"
      intro="Newton Property Management is an established Scottish property factor operating across multiple regions, including Edinburgh, Glasgow, Aberdeen, and Inverness. Newton manages a range of residential developments, including large and complex sites with shared facilities."
      logoSrc="/images/logo/newton-logo-removebg-preview.png"
      logoAlt="Newton Property Management logo"
      managementTitle="How Newton would manage James Square"
      managementText="Newton Property Management operates a structured, systems-based factoring model with defined processes for reporting, escalation, and oversight. Management would be delivered through a named property manager supported by centralised systems designed to provide consistency and visibility across maintenance and compliance matters."
      communicationText="Maintenance issues would be logged, tracked, and assigned through Newton’s internal systems, with responsibility held by a named property manager. Progress would be monitored and escalated where required, with updates available to the committee as matters are progressed."
      costs={[
        { label: 'Total annual budget:', value: 'approximately £192,700' },
        { label: 'Approximate cost per flat:', value: 'around £1,870 per year (about £156 per month)' },
        { label: 'Management fee:', value: '£180 plus VAT per flat per year' },
        { label: 'Float required:', value: '£300 per flat (refundable)' },
        { label: 'Insurance:', value: 'potential savings identified' },
      ]}
      documentationLinks={[
        {
          href: '/images/venues/Newton-Tender-Doc.pdf',
          label: 'View Newton tender documentation (PDF)',
        },
        {
          href: '/images/venues/Newton-Cost-doc.pdf',
          label: 'View Newton cost breakdown (PDF)',
        },
        {
          href: '/images/Debt%20Recover%20Procedure%20PDF_V8.pdf',
          label: 'View debt recovery procedure (PDF)',
        },
      ]}
      postDocumentationContent={
        <>
          <TimedVimeoEmbed
            videoId="1156997722"
            title="Newton – Online Presentation"
            expiryDate={PRESENTATION_EXPIRY}
            aspectRatio={75}
          />
          <VotingCallout />
        </>
      }
    />
  );
};

export default NewtonPage;
