import type { Metadata } from 'next';

import FactorInfoPage from '@/components/FactorInfoPage';

export const metadata: Metadata = {
  title: 'Newton Property Management | James Square',
  description: 'Information for James Square owners about Newton Property Management factoring proposal.',
};

const NewtonPage = () => {
  return (
    <FactorInfoPage
      title="Newton Property Management"
      subtitle="Information for James Square owners"
      intro="Newton Property Management is an established Scottish property factor operating across multiple regions, including Edinburgh, Glasgow, Aberdeen, and Inverness. Newton manages a range of residential developments, including large and complex sites with shared facilities."
      logoSrc="/images/logo/newton-logo-removebg-preview.png"
      logoAlt="Newton Property Management logo"
      managementTitle="How Newton would manage James Square"
      managementPoints={[
        'Structured, systems-based factoring model',
        'Named property manager and assistant',
        'Centralised maintenance tracking',
        'Formal escalation and reporting processes',
        'Regular communication with the committee',
      ]}
      caretakerTitle="Caretaker arrangements"
      caretakerIntro="James Square already has a caretaker in post."
      caretakerPoints={[
        'The existing caretaker would be expected to transfer across (subject to TUPE)',
        'Caretaker supported through Newton payroll and HR systems',
        'Clear line management and escalation routes',
        'Planned holiday and sickness cover',
      ]}
      communicationPoints={[
        'Maintenance issues logged and tracked',
        'Responsibility assigned to a named manager',
        'Progress monitored and escalated where required',
        'Updates provided to the committee',
        'Online systems used for reporting and visibility',
      ]}
      costs={[
        'Total annual budget: ~£192,700',
        'Approximate cost per flat: ~£1,870 per year (~£156 per month)',
        'Management fee: £180 + VAT per flat per year',
        'Float required: £300 per flat (refundable)',
        'Potential insurance savings identified',
      ]}
      documentationHref="/images/venues/newton-tender-doc.pdf"
      documentationLabel="View Newton tender documentation (PDF)"
    />
  );
};

export default NewtonPage;
