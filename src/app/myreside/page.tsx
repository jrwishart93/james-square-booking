import type { Metadata } from 'next';

import { Info } from 'lucide-react';

import FactorInfoPage from '@/components/FactorInfoPage';
import { GlassCard } from '@/components/GlassCard';

const socialTitle = 'Myreside Management | James Square';
const socialDescription = 'Information for James Square owners about Myreside Management as the active property factor.';
const socialImage = 'https://www.james-square.com/images/logo/Myreside-JS-image.png';
const canonicalUrl = 'https://www.james-square.com/myreside';

export const metadata: Metadata = {
  title: socialTitle,
  description: socialDescription,
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: canonicalUrl,
    type: 'website',
    images: [
      {
        url: socialImage,
        width: 1536,
        height: 1024,
        alt: 'Myreside Management factor information for James Square',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: socialDescription,
    images: [socialImage],
  },
};

const MyresidePage = () => {
  return (
    <FactorInfoPage
      title="Myreside Management"
      subtitle="Active property factor for James Square"
      intro={
        <>
          <p>
            Following a decision by owners at the Extraordinary General Meeting and subsequent vote, Myreside
            Management was appointed as factor for James Square and formally took over management on 1 February 2025.
          </p>
          <p>
            Myreside Management now manages day-to-day operations for the development, including owner communications,
            payments, contractor coordination, and routine site oversight.
          </p>
        </>
      }
      alertContent={
        <div
          role="status"
          className="w-full rounded-2xl border border-sky-200/80 bg-sky-50/90 p-6 text-left text-slate-800 shadow-sm dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-slate-100"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-800/60 dark:text-sky-100">
              <Info className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Update – Myreside Management Now Acting as Factor
            </h2>
          </div>
          <div className="mt-4 space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
            <p>Myreside Management have now formally taken over as factor for James Square.</p>
            <p>
              All owners should ensure that any previous payments to Fior Asset &amp; Property have been stopped and
              that new payment arrangements are made directly with Myreside Management.
            </p>
            <p>
              If you have not yet made contact with Myreside, please do so as soon as possible to confirm your
              details and arrange ongoing building payments.
            </p>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">Myreside Management Limited</p>
              <p>3 Dalkeith Road Mews</p>
              <p>Edinburgh</p>
              <p>EH16 5GA</p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Telephone:</span> 0131 466 3001
              </p>
            </div>
          </div>
          <a
            href="https://myreside-management.co.uk/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto"
          >
            Contact Myreside Management
          </a>
        </div>
      }
      logoSrc="/images/logo/myreside-logo-removebg-preview.png"
      logoAlt="Myreside Management logo"
      statusTitle="Current status"
      statusContent={
        <>
          <p>Myreside Management is now responsible for managing James Square.</p>
          <p>Fior Asset &amp; Property no longer acts as factor for the development.</p>
          <p>All owner payments, account queries, and management-related requests should be directed to Myreside.</p>
        </>
      }
      managementTitle="How Myreside manages James Square"
      managementText="Myreside Management manages James Square using a traditional factoring model, with an emphasis on in-house service delivery, regular site inspections, and practical day-to-day management. Myreside works directly with the owners’ committee and addresses issues through a responsive and flexible approach."
      communicationText="Communication is handled directly through Myreside by phone, email, and their online contact channels. Maintenance is coordinated through Myreside’s internal teams and approved contractors, with committee involvement where appropriate."
      costs={[]}
      costsTitle="Current costs and documentation"
      costsContent={
        <div className="space-y-6 text-sm md:text-base text-slate-700 dark:text-slate-200">
          <div className="space-y-2">
            <p>
              The documents below set out the current Myreside management framework and active cost structure for
              James Square.
            </p>
            <p>
              Owners should use these figures and terms as the live basis for ongoing factoring and payment
              arrangements.
            </p>
            <p>
              They have advised that two modest incentives have been introduced for owners who choose to pay by Direct
              Debit and who opt to receive communications digitally. Myreside have explained that these changes follow a
              review of their operational processes and costs and are intended to pass on genuine efficiency savings to
              owners, rather than change the underlying management fee.
            </p>
            <p>
              Myreside have also confirmed that the building insurance figure has been amended to reflect the final
              premium agreed with their broker and insurer. They have stated that this premium has been set with full
              knowledge of the building’s claims history and is not subject to later adjustment on that basis.
            </p>
            <p>
              They have noted that they are continually reviewing how they deliver services and looking for ways to
              improve efficiency and value for owners, and that these updates form part of that ongoing process.
            </p>
            <p>
              Owners are encouraged to refer to the linked documentation for full details of current service delivery
              and charging.
            </p>
          </div>
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
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,719.68</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£143.31</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 45</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">19</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,734.45</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£144.54</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 51</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">31</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,722.59</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£143.55</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 55</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">15</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,722.10</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£143.51</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 57</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,780.30</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£148.36</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 59</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,780.30</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£148.36</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 61</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">8</td>
                    <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,756.05</td>
                    <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£146.34</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Block 65</td>
                    <td className="py-2 pr-4">2</td>
                    <td className="py-2 pr-4">£1,974.30</td>
                    <td className="py-2">£164.53</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-2">
              <p>Costs are not averaged across the development.</p>
              <p>Each block’s cost reflects the number of flats in that block.</p>
              <p>Lift maintenance and insurance are included where applicable.</p>
              <p>Fire safety systems such as dry risers and alarm panels are also included.</p>
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
            <p>The newly introduced incentives do not change the base management fee.</p>
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
            <p>
              The building insurance premium is £38,000 and has been agreed with Myreside’s broker and insurer with full
              knowledge of the building’s claims history, so it is not subject to later adjustment on that basis.
            </p>
            <p>Myreside does not take commission on building insurance premiums.</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">*updated 18/01/2026</p>
        </div>
      }
      documentationLinks={[
        {
          href: '/images/venues/myreside-tender-update-18jan.pdf',
          label: 'View current Myreside management documentation (18 January 2025 PDF)',
        },
      ]}
      additionalContent={
        <>
          <GlassCard title="Confirm your details and payment arrangements" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                Owners should contact Myreside Management now to confirm contact details, update account information,
                and ensure payment arrangements are active.
              </p>
              <p>
                Use the portal or contact channels below for billing questions, statement queries, and ongoing
                management requests.
              </p>
              <div className="space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-200">
                <p>Myreside Management Limited</p>
                <p>3 Dalkeith Road Mews</p>
                <p>Edinburgh</p>
                <p>EH16 5GA</p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Telephone:</span> 0131 466 3001
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Email:</span>{' '}
                  <a href="mailto:info@myreside-management.co.uk" className="underline underline-offset-2">
                    info@myreside-management.co.uk
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm md:text-base text-slate-700 dark:text-slate-200">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Owner portal:</span>{' '}
                  <a href="https://myreside-management.co.uk/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    myreside-management.co.uk
                  </a>
                </p>
              </div>
              <a
                href="https://myreside-management.co.uk/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
              >
                Contact Myreside via online form
              </a>
            </div>
          </GlassCard>
          <GlassCard
            title="Cleaning Standard – Current Service Overview"
            titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                One-page summary prepared by Myreside Management outlining the current routine cleaning standard in
                place at James Square.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/images/buildingimages/Cleaning.pdf"
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-[1.05] jqs-glass dark:text-slate-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Cleaning Standard PDF
                </a>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Opens in a new tab for easy viewing.
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-[3/4] w-full">
                  <iframe
                    title="Cleaning Standard – Current Service Overview PDF preview"
                    src="/images/buildingimages/Cleaning.pdf"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </>
      }
    />
  );
};

export default MyresidePage;
