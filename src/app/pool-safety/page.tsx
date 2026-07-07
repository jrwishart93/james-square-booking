import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const OG_IMAGE = '/images/pool/BC0D4867-E841-4F44-B7B8-90030F8D2E6B.jpeg';

export const metadata: Metadata = {
  title: 'Swimming Pool — James Square Residents',
  description:
    "Information on our residents' pool: facility overview, water quality, safety signage and pool rules.",
  openGraph: {
    title: 'Swimming Pool — James Square Residents',
    description:
      "Information on our residents' pool: facility overview, water quality, safety signage and pool rules.",
    images: [
      {
        url: OG_IMAGE,
        width: 848,
        height: 1060,
        alt: 'The James Square residents’ swimming pool',
      },
    ],
  },
};

const navLinks = [
  { href: '#facility-overview', label: 'Overview' },
  { href: '#how-to-use-it', label: 'How to use it' },
  { href: '#water-quality', label: 'Water quality' },
  { href: '#cleaning-maintenance', label: 'Cleaning' },
  { href: '#emergency-equipment', label: 'Emergency equipment' },
  { href: '#safety-signage', label: 'Signage' },
  { href: '#pool-rules', label: 'Pool rules' },
  { href: '#supervision', label: 'Supervision' },
];

const facilityPhotos = [
  {
    src: '/images/pool/Pool-facing-south.png',
    alt: 'The heated indoor swimming pool, facing south',
    caption: 'The heated pool',
  },
  {
    src: '/images/pool/03-gym-facing-south.jpeg',
    alt: 'The small gymnasium next to the pool',
    caption: 'The gym',
  },
  {
    src: '/images/pool/05-sauna-entrance-door.jpeg',
    alt: 'The sauna entrance and adjoining changing room door',
    caption: 'Sauna & changing rooms',
  },
  {
    src: '/images/pool/06-male-changing-room.jpeg',
    alt: 'One of the changing rooms',
    caption: 'Changing rooms',
  },
];

const waterQualityRanges = [
  { parameter: 'pH', range: '7.40 – 7.80' },
  { parameter: 'Chlorine', range: '0.80 – 4.30 ppm' },
];

const emergencyEquipment = [
  { item: 'Lifebuoy (main entrance)', provided: true },
  { item: 'Lifebuoy (east pool wall)', provided: true },
  { item: 'Reach pole / pool net', provided: true },
  { item: 'Fire alarm call point', provided: true },
  { item: 'Fire action notices', provided: true },
  { item: 'CCTV', provided: true },
  { item: 'Intruder alarm', provided: true },
  { item: 'First aid kit', provided: false },
  { item: 'Defibrillator (AED)', provided: false, note: 'nearest public AED approx. 100m away' },
];

const signagePhotos = [
  {
    src: '/images/pool/01-entrance-hallway.jpeg',
    alt: 'Entrance signage: no eating or drinking, CCTV in operation, no outdoor footwear, hygiene notice and the resident booking QR code',
    caption: 'Entrance notices: no eating/drinking, CCTV in operation, no outdoor footwear, hygiene reminder and the booking QR code',
  },
  {
    src: '/images/pool/Pool-entrance.png',
    alt: 'Lifebuoy for emergency use only, next to a fire alarm call point at the pool hall exit',
    caption: 'Lifebuoy (“for emergency use only”) and fire alarm call point at the pool hall exit',
  },
  {
    src: '/images/pool/Pool-facing-south.png',
    alt: 'No diving sign displayed poolside',
    caption: 'No diving sign, displayed poolside',
  },
  {
    src: '/images/pool/05-sauna-entrance-door.jpeg',
    alt: 'Hygiene notice and single-household changing room notice',
    caption: 'Hygiene reminder and single-household changing room notice',
  },
  {
    src: '/images/pool/03-gym-facing-south.jpeg',
    alt: 'Hygiene and cross-contamination warning signage in the gym',
    caption: 'Hygiene and cross-contamination warning notices',
  },
];

const fullSignageList = [
  { label: 'No outdoor footwear', photographed: true },
  { label: 'CCTV in operation', photographed: true },
  { label: 'No eating or drinking', photographed: true },
  { label: 'Shower before entering the pool', photographed: false },
  { label: 'Hand sanitising notice', photographed: true },
  { label: 'Fire action notices', photographed: false },
  { label: 'Pool opening hours', photographed: false },
  { label: 'Building alarm reminder', photographed: false },
  { label: 'Deep end depth marker (1.70m)', photographed: false },
  { label: 'Shallow end depth marker (0.80m)', photographed: false },
  { label: 'No running', photographed: false },
  { label: 'Lifebuoy for emergency use only', photographed: true },
  { label: 'Cross contamination warning', photographed: true },
  { label: 'Fire door signage', photographed: false },
  { label: 'Emergency exit signage', photographed: false },
];

const poolRuleGroups = [
  {
    title: 'Supervision & who can use the pool',
    items: [
      'For the use of James Square residents and their invited guests only.',
      'Children under 16 must be accompanied by a responsible adult at all times.',
    ],
  },
  {
    title: 'Hygiene',
    items: [
      'Please shower before entering the pool.',
      'Please use hand sanitiser on entry.',
      'No outdoor footwear beyond the entrance.',
    ],
  },
  {
    title: 'Safe use',
    items: [
      'No diving.',
      'No running around the pool or wet areas.',
      'No eating or drinking in the pool hall.',
      'Take care using the sauna and follow the posted guidance for safe use.',
    ],
  },
  {
    title: 'Conduct & shared use',
    items: [
      'No alcohol and no smoking anywhere in the facility.',
      'Please leave the pool area by 11pm.',
      'Please do not obstruct or misuse lifebuoys, reach poles or other emergency equipment.',
      'Please be considerate of other residents sharing the space.',
    ],
  },
];

export default function PoolSafetyPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-3 pb-16 sm:px-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 shadow-xl shadow-sky-950/10 dark:border-white/10">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
          <Image
            src={OG_IMAGE}
            alt="The James Square residents’ swimming pool"
            fill
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">James Square</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Our Swimming Pool — How It Works & Staying Safe
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base sm:leading-7">
            James Square&rsquo;s indoor pool is a private facility for residents and their invited guests. This page
            explains how it operates day to day, the safety measures and signage in place, and the rules we ask
            everyone to follow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/pool3d"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              See the 3D model of the facility
            </Link>
          </div>
        </div>
      </section>

      <nav
        aria-label="Page sections"
        className="sticky top-[70px] z-30 -mx-3 overflow-x-auto border-y border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-3 dark:border-white/10 dark:bg-slate-950/95"
      >
        <ul className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="facility-overview" aria-labelledby="facility-overview-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="facility-overview-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Facility overview
        </h2>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
          James Square is a private residential development in Edinburgh of 103 properties. Residents have access to a
          communal indoor leisure facility comprising a heated swimming pool, an infrared sauna, a small gymnasium,
          male and female changing rooms, showers and toilets.
        </p>
        <ul className="grid gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:grid-cols-2 sm:text-base">
          <li className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
            <span className="font-semibold text-slate-950 dark:text-white">Pool size:</span> approx. 11m long by
            4.5m wide
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
            <span className="font-semibold text-slate-950 dark:text-white">Depth:</span> 0.80m at the shallow end to
            1.70m at the deep end
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
            <span className="font-semibold text-slate-950 dark:text-white">Water temperature:</span> normally kept
            between 28°C and 30°C, using an air source heat pump installed in 2025
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
            <span className="font-semibold text-slate-950 dark:text-white">Also on site:</span> infrared sauna, small
            gym, changing rooms, showers and toilets
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facilityPhotos.map((photo) => (
            <figure
              key={photo.src}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-2.5 py-2 text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="how-to-use-it" aria-labelledby="how-to-use-it-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="how-to-use-it-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          How to use it
        </h2>
        <div className="grid gap-6 sm:grid-cols-[1.1fr,0.9fr] sm:items-start">
          <div className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
            <p>
              The pool is for James Square residents and their invited guests only — it is not open to the general
              public. Use of the facility is generally low, at fewer than 25 individual users a week.
            </p>
            <p>
              An online booking system, introduced during the COVID-19 pandemic to manage occupancy, remains in
              operation and residents are encouraged to reserve the facility before use. While booking isn&rsquo;t
              strictly enforced, residents generally cooperate, and in practice the facility is normally used by a
              single household at any one time.
            </p>
            <p>
              Access is controlled and the facility is covered by CCTV.
            </p>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
              <Image
                src="/images/pool/01-entrance-hallway.jpeg"
                alt="Booking information and QR code displayed at the pool entrance"
                fill
                loading="lazy"
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs leading-tight text-slate-600 dark:text-slate-300">
              Booking information and QR code, displayed at the entrance
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="water-quality" aria-labelledby="water-quality-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="water-quality-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Water quality
        </h2>
        <div className="grid gap-6 sm:grid-cols-[1.1fr,0.9fr] sm:items-start">
          <div className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
            <p>
              Water chemistry is managed by an automated Wallace &amp; Tiernan dosing and monitoring system, which
              continuously tracks free chlorine and pH. Readings are recorded daily, and independent manual testing
              is carried out weekly to double-check the automated system stays correctly calibrated.
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-sky-50 text-xs font-semibold uppercase tracking-wide text-sky-800 dark:bg-sky-300/10 dark:text-sky-100">
                  <tr>
                    <th className="px-4 py-2.5">Parameter</th>
                    <th className="px-4 py-2.5">Target range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {waterQualityRanges.map((row) => (
                    <tr key={row.parameter} className="bg-white dark:bg-slate-900/60">
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{row.parameter}</td>
                      <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{row.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specialist servicing of the dosing equipment is provided by Aquatech, who installed the majority of the
              pool plant.
            </p>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
              <Image
                src="/images/pool/IMG_4149.jpeg"
                alt="Pool water filtration and dosing plant"
                fill
                loading="lazy"
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs leading-tight text-slate-600 dark:text-slate-300">
              Pool water filtration and dosing plant
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="cleaning-maintenance" aria-labelledby="cleaning-maintenance-heading" className="scroll-mt-[140px] space-y-3">
        <h2 id="cleaning-maintenance-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Cleaning &amp; maintenance
        </h2>
        <ul className="space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
          <li>The leisure facility is cleaned each weekday morning by cleaning contractors appointed by Myreside Management.</li>
          <li>The caretaker carries out routine visual inspections and monitors plant operation during normal working hours.</li>
          <li>Specialist servicing of pool equipment is carried out by Aquatech when required.</li>
        </ul>
      </section>

      <section id="emergency-equipment" aria-labelledby="emergency-equipment-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="emergency-equipment-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Emergency equipment — good to know
        </h2>
        <div className="grid gap-6 sm:grid-cols-[1fr,1fr] sm:items-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {emergencyEquipment.map((row) => (
                  <tr key={row.item} className="bg-white dark:bg-slate-900/60">
                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100">
                      {row.item}
                      {row.note ? (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{row.note}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          row.provided
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
                        }`}
                      >
                        {row.provided ? 'Provided' : 'Not on site'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
              <Image
                src="/images/pool/Pool-entrance.png"
                alt="Lifebuoy and fire alarm call point at the pool hall exit"
                fill
                loading="lazy"
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs leading-tight text-slate-600 dark:text-slate-300">
              Lifebuoy and fire alarm call point at the pool hall exit
            </figcaption>
          </figure>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-4 text-sm leading-6 text-sky-900 dark:border-sky-300/20 dark:bg-sky-300/10 dark:text-sky-100">
          <p className="font-semibold">Nearest public defibrillators (AEDs)</p>
          <ul className="mt-1.5 space-y-1">
            <li>St Bride&rsquo;s Community Centre, Orwell Terrace — approx. 100m from the pool building</li>
            <li>Dalry Leisure Centre, Caledonian Crescent</li>
          </ul>
          <p className="mt-2 text-xs text-sky-800/90 dark:text-sky-100/80">
            In a medical emergency, always call 999 first.
          </p>
        </div>
      </section>

      <section id="safety-signage" aria-labelledby="safety-signage-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="safety-signage-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Safety signage
        </h2>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
          Signage is displayed throughout the leisure facility to encourage safe use of the pool and its surrounding
          areas.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signagePhotos.map((photo) => (
            <figure
              key={`${photo.src}-${photo.caption}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-3 py-2.5 text-xs leading-snug text-slate-600 dark:text-slate-300">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">All signage currently in place</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Close-up photographs of every individual sign are still being added — items marked below are already
            shown in the photos above.
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-slate-700 sm:grid-cols-2 dark:text-slate-200">
            {fullSignageList.map((sign) => (
              <li key={sign.label} className="flex items-center justify-between gap-3 border-b border-slate-100 py-1 dark:border-white/5">
                <span>{sign.label}</span>
                {sign.photographed ? (
                  <span className="shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Photographed</span>
                ) : (
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">Photo to follow</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pool-rules" aria-labelledby="pool-rules-heading" className="scroll-mt-[140px] space-y-4">
        <h2 id="pool-rules-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Pool rules
        </h2>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
          The full Pool &amp; Recreation Area Health &amp; Safety Rules are displayed at the main entrance. Key
          points are summarised below.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {poolRuleGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/60"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{group.title}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="supervision"
        aria-labelledby="supervision-heading"
        className="scroll-mt-[140px] space-y-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-5 dark:border-amber-300/20 dark:bg-amber-300/10"
      >
        <h2 id="supervision-heading" className="text-xl font-bold text-amber-950 dark:text-amber-100">
          Please note: this is an unsupervised facility
        </h2>
        <p className="text-sm leading-7 text-amber-900 dark:text-amber-100/90 sm:text-base">
          There is no qualified lifeguard on duty at any time. A CCTV feed exists in the caretaker&rsquo;s office, but
          it is not continuously monitored and should not be relied on as active supervision. The caretaker is
          normally on site Monday to Friday, roughly 6am to 2pm, but is not responsible for supervising pool users.
        </p>
        <p className="text-sm leading-7 text-amber-900 dark:text-amber-100/90 sm:text-base">
          Residents and their guests are expected to exercise personal responsibility and follow the pool rules at
          all times. Children under 16 must be accompanied by a responsible adult at all times.
        </p>
      </section>

      <section className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/60">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Want to see the layout for yourself? Explore the interactive 3D model of the pool area.
        </p>
        <Link
          href="/pool3d"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-50"
        >
          See the 3D model of the facility
        </Link>
      </section>
    </main>
  );
}
