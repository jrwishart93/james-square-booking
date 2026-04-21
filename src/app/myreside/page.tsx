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
      subtitle="Current property factor for James Square, active from 1 February 2026"
      intro={
        <p>
          Myreside Management is the current property factor for James Square. This page brings together the key
          contact details, maintenance routes, owner payment information, costs, and documents residents may need.
        </p>
      }
      alertContent={
        <div
          role="note"
          className="w-full rounded-2xl border border-sky-200/80 bg-sky-50/90 p-5 text-left text-slate-800 shadow-sm dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-slate-100"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-800/60 dark:text-sky-100">
                <Info className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current factor</h2>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Myreside Management has acted as the James Square factor since 1 February 2026. Fior Asset &amp;
                  Property no longer manages the development.
                </p>
              </div>
            </div>
            <a
              href="#myreside-contact"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              View contact details
            </a>
          </div>
        </div>
      }
      logoSrc="/images/logo/myreside-logo-removebg-preview.png"
      logoAlt="Myreside Management logo"
      managementTitle="How Myreside manages James Square"
      managementText="Myreside coordinates routine site oversight, contractor management, compliance administration, building services, and liaison with the owners’ committee for James Square’s shared areas."
      communicationText="Residents can contact Myreside about shared-area maintenance and building management matters. Owners should use Myreside for account, payment, billing, and statement queries."
      costs={[]}
      costsTitle="Owner costs summary"
      costsContent={
        <div className="space-y-6 text-sm md:text-base text-slate-700 dark:text-slate-200">
          <p>
            For owners, the current Myreside documentation sets out the live cost structure for factoring, insurance,
            maintenance, and shared services at James Square.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total annual budget
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">£179,045.92</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Management fee
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">£180 per flat per year</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Float
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">£450 per flat</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Held as a refundable working balance, subject to account balance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Insurance commission
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">None</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Building insurance premium: £38,000.
              </p>
            </div>
          </div>

          <details className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900 marker:text-slate-500 dark:text-slate-100">
              View block-by-block cost table
            </summary>
            <div className="mt-4 overflow-x-auto">
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
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Costs vary by block and are not averaged across the development. Owners should refer to the row for
              their own block.
            </p>
          </details>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Updated 18/01/2026. Owners should refer to Myreside’s documentation for full terms, service details, and
            any applicable payment or digital communication incentives.
          </p>
        </div>
      }
      documentationLinks={[
        {
          href: '/images/venues/myreside-tender-update-18jan.pdf',
          label: 'View Myreside management documentation (18 January update PDF)',
        },
        {
          href: '/images/buildingimages/Cleaning.pdf',
          label: 'View cleaning standard PDF',
        },
      ]}
      additionalContent={
        <>
          <div id="myreside-contact">
            <GlassCard
              title="Contact Myreside"
              titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            >
              <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
                <p>
                  Use these details for shared-area maintenance, building management matters, and owner account
                  queries.
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">For owners:</span> payment
                  arrangements, billing questions, and statement queries should be handled directly with Myreside.
                </p>
                <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4 dark:border-sky-700/60 dark:bg-sky-900/30">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Myreside owner portal
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        Owners can manage direct debits, view important documents, and check proposed works through
                        the portal.
                      </p>
                    </div>
                    <a
                      href="https://portal.myreside-management.co.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Open Myreside Portal
                    </a>
                  </div>
                </div>
                <div className="space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-200">
                  <p>Myreside Management Limited</p>
                  <p>3 Dalkeith Road Mews</p>
                  <p>Edinburgh</p>
                  <p>EH16 5GA</p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Telephone:</span> 0131 466
                    3001
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">24hr emergencies:</span> 0131
                    466 3001, then press 1
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Email:</span>{' '}
                    <a href="mailto:info@myreside-management.co.uk" className="underline underline-offset-2">
                      info@myreside-management.co.uk
                    </a>
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
                  <a
                    href="https://myreside-management.co.uk/contact-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
                  >
                    Online contact form
                  </a>
                  <a
                    href="https://myreside-management.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
                  >
                    Myreside website
                  </a>
                  <a
                    href="mailto:info@myreside-management.co.uk"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
                  >
                    Email Myreside
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
          <GlassCard
            title="Cleaning standard"
            titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                Myreside’s current routine cleaning standard for James Square is available as a compact PDF summary.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/images/buildingimages/Cleaning.pdf"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Cleaning Standard PDF
                </a>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Opens in a new tab for easy viewing.
                </span>
              </div>
            </div>
          </GlassCard>
        </>
      }
      importantNoteContent={
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Important note</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Information on this page is provided as a practical guide for residents and owners. For formal account,
            payment, or service instructions, use Myreside’s own correspondence, portal, and documentation.
          </p>
        </div>
      }
    />
  );
};

export default MyresidePage;
