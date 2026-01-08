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
      managementPoints={[
        'Traditional factoring model',
        'Emphasis on in-house service delivery',
        'Regular site inspections',
        'Close working relationship with the owners’ committee',
        'Flexible, practical approach rather than rigid systems',
      ]}
      caretakerTitle="Caretaker arrangements"
      caretakerIntro="James Square already has a caretaker in post."
      caretakerPoints={[
        'The existing caretaker would be expected to transfer across (subject to TUPE)',
        'Caretaking, cleaning, and minor maintenance duties may overlap where required',
        'Day-to-day support would be provided by Myreside’s internal team',
        'Holiday and sickness cover would be arranged internally',
      ]}
      communicationPoints={[
        'Direct contact with a named property manager',
        'Issues raised by phone or email',
        'Maintenance progressed via internal teams or approved contractors',
        'Committee involvement encouraged where appropriate',
      ]}
      costs={[
        'Total annual budget: ~£179,000',
        'Approximate cost per flat: ~£1,740 per year (~£145 per month)',
        'Management fee: £150 + VAT per flat per year',
        'Float required: £450 per flat (refundable)',
        'No commission taken on buildings insurance',
      ]}
      documentationHref="/images/venues/myreside-tender-doc.pdf"
      documentationLabel="View Myreside tender documentation (PDF)"
    />
  );
};

export default MyresidePage;
