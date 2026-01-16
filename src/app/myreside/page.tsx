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
      costs={[]}
      costsTitle="Costs Summary (Myreside Proposal)"
      costsContent={
        <div className="space-y-6 text-sm md:text-base text-slate-700 dark:text-slate-200">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overall budget</h3>
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Total annual factoring budget:</span>{' '}
              £179,045.92
            </p>
            <p>This represents the full annual cost to manage and maintain James Square across all 103 properties.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Block-specific costs</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block</th>
                    <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Number of flats</th>
                    <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Annual cost per flat</th>
                    <th className="border-b border-slate-200/80 py-2 dark:border-white/10">Monthly cost per flat</th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 39</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">16</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,739.09</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£144.92</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 45</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">19</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,753.87</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£146.16</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 51</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">31</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,742.01</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£145.17</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 55</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">15</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,741.52</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£145.13</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 57</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,799.72</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£149.98</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 59</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,799.72</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£149.98</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 61</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">8</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,775.47</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£147.96</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Block 65</td>
                    <td className="py-2 pr-4">2</td>
                    <td className="py-2 pr-4">£1,993.72</td>
                    <td className="py-2">£166.14</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-2">
              <p>Costs are not averaged across the development.</p>
              <p>Each block’s cost reflects:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Number of flats in that block</li>
                <li>Lift maintenance and insurance (where applicable)</li>
                <li>Fire safety systems such as dry risers and alarm panels</li>
              </ul>
              <p>Smaller blocks and blocks with additional infrastructure have a higher per-flat share.</p>
              <p>Owners should refer to the figures for their block only.</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Management fee</h3>
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Management fee:</span> £180 per flat per
              year
            </p>
            <p>This fee is included within the figures shown above.</p>
            <p>Covers property management, contractor coordination, compliance administration, and financial management.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Float</h3>
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Float required:</span> £450 per flat
            </p>
            <p>Held as a refundable working balance, not a fee.</p>
            <p>Used for cashflow and urgent expenditure.</p>
            <p>Returned to the owner on sale, subject to account balance.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Insurance commission</h3>
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Insurance commission:</span> none
            </p>
            <p>Myreside does not take commission on building insurance premiums.</p>
          </div>
        </div>
      }
      documentationLinks={[
        {
          href: '/images/venues/myreside-tender-doc.pdf',
          label: 'View Myreside tender documentation (PDF)',
        },
      ]}
    />
  );
};

export default MyresidePage;
