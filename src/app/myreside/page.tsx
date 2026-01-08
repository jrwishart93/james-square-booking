import type { Metadata } from 'next';

import FactorInfoPage from '@/components/FactorInfoPage';

export const metadata: Metadata = {
  title: 'Myreside Management | James Square',
  description: 'Information for James Square owners about Myreside Management factoring proposal.',
};

const MyresidePage = () => {
  return (
    <FactorInfoPage
      title="Myreside Management"
      subtitle="Information for James Square owners"
      intro="Myreside Management is an Edinburgh-based property factor with over 25 years’ experience managing residential developments across the city and surrounding areas. The company presents itself as a hands-on, relationship-led factor with strong director involvement."
      logoSrc="/images/logo/myreside-logo-removebg-preview.png"
      logoAlt="Myreside Management logo"
      managementTitle="How Myreside would manage James Square"
      managementText="Myreside Management operates a traditional factoring model, with an emphasis on in-house service delivery and regular site inspections. Their approach focuses on maintaining a close working relationship with the owners’ committee and dealing with issues in a practical and flexible manner rather than relying on rigid systems or processes."
      communicationText="Communication would be handled directly through a named property manager, with issues raised by phone or email. Maintenance would be coordinated using Myreside’s internal teams or approved contractors, with committee involvement where appropriate and agreed."
      costs={[
        { label: 'Total annual budget:', value: 'approximately £179,000' },
        { label: 'Approximate cost per flat:', value: 'around £1,740 per year (about £145 per month)' },
        { label: 'Management fee:', value: '£150 plus VAT per flat per year' },
        { label: 'Float required:', value: '£450 per flat (refundable)' },
        { label: 'Insurance commission:', value: 'none taken' },
      ]}
      documentationHref="/images/venues/myreside-tender-doc.pdf"
      documentationLabel="View Myreside tender documentation (PDF)"
    />
  );
};

export default MyresidePage;
