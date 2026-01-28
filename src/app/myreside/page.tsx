import type { Metadata } from 'next';

import { Info } from 'lucide-react';

import FactorInfoPage from '@/components/FactorInfoPage';
import { GlassCard } from '@/components/GlassCard';

const socialTitle = 'Myreside Management | James Square';
const socialDescription = 'Information for James Square owners about Myreside Management as incoming property factor.';
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
        alt: 'Myreside Management incoming factor notice for James Square',
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
      subtitle="Incoming property factor for James Square"
      intro={
        <>
          <p>
            Following a decision by owners at the Extraordinary General Meeting and subsequent vote, Myreside
            Management has been selected as the preferred replacement factor for James Square.
          </p>
          <p>
            Myreside Management intend to take over the management of the development from 1 February 2025, subject to
            final confirmation and completion of handover arrangements with the outgoing factor.
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
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Update – Incoming factor change</h2>
          </div>
          <div className="mt-4 space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
            <p>
              Myreside Management intend to take over as factor for James Square from 1 February 2025.
            </p>
            <p>
              All owners are advised to contact Myreside Management for further information and to arrange any new
              building payment arrangements prior to this date where possible.
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
          <p>Fior Asset &amp; Property remains responsible for the management of James Square until midnight on 31 January.</p>
          <p>
            During the transition period, the committee is working with both factors to ensure an orderly handover of
            records, contracts, and services.
          </p>
          <p>This helps prevent confusion during the overlap period.</p>
        </>
      }
      managementTitle="How Myreside will manage James Square"
      managementText="Myreside Management will manage James Square using a traditional factoring model, with an emphasis on in-house service delivery and regular site inspections. Myreside’s approach includes maintaining a close working relationship with the owners’ committee and dealing with issues in a practical and flexible manner rather than relying on rigid systems or processes."
      communicationText="Communication will be handled directly through a named property manager, with issues raised by phone or email. Maintenance will be coordinated using Myreside’s internal teams or approved contractors, with committee involvement where appropriate and agreed."
      costs={[]}
      costsTitle="Costs and documentation"
      costsContent={
        <div className="space-y-6 text-sm md:text-base text-slate-700 dark:text-slate-200">
          <div className="space-y-2">
            <p>
              The documents below were provided by Myreside Management during the selection process and are shared for
              reference.
            </p>
            <p>
              Myreside have provided an updated version of their tender following a further internal review of their
              proposal.
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
              In addition, Myreside have advised that they will be carrying out sample deep cleaning works at James
              Square, including areas such as the pool, the main entrance, sections of carpet, and bin areas. This is
              intended to demonstrate the standard of cleaning they expect to deliver once management begins. They have
              indicated that a short document with before-and-after photographs will be prepared and made available for
              owners to review.
            </p>
            <p>Owners are encouraged to refer to the updated tender document for full details.</p>
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
          label: 'View updated Myreside tender documentation (18 January 2025 PDF)',
        },
      ]}
      additionalContent={
        <>
          <GlassCard title="Contact Myreside Management" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                Owners are encouraged to contact Myreside Management directly to ensure their details are up to date and
                to arrange any new payment plans or standing orders ahead of the proposed transfer date.
              </p>
              <p>
                Early contact will help support a smooth transition once the handover is confirmed.
              </p>
              <div className="space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-200">
                <p>Myreside Management Limited</p>
                <p>3 Dalkeith Road Mews</p>
                <p>Edinburgh</p>
                <p>EH16 5GA</p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Telephone:</span> 0131 466 3001
                </p>
              </div>
              <a
                href="https://myreside-management.co.uk/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
              >
                Contact Myreside Management
              </a>
            </div>
          </GlassCard>
          <GlassCard
            title="Cleaning Standard – Current vs Planned"
            titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                One-page summary prepared by Myreside Management outlining the current routine cleaning standard at
                James Square and the enhanced standard expected once Myreside begins management.
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
                    title="Cleaning Standard – Current vs Planned PDF preview"
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
