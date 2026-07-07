import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'James Square — Pool Operations & Preliminary Safety Pack',
  description: 'Internal document prepared to support an independent RLSS safety review. Not for public distribution.',
  robots: { index: false, follow: false, nocache: true },
};

const waterQualityRanges = [
  { parameter: 'pH', range: '7.40 – 7.80' },
  { parameter: 'Chlorine', range: '0.80 – 4.30 ppm' },
];

const emergencyEquipment = [
  { item: 'Lifebuoy (Main Entrance)', provided: true },
  { item: 'Lifebuoy (East Pool Wall)', provided: true },
  { item: 'Reach Pole / Pool Net', provided: true },
  { item: 'Fire Alarm Call Point', provided: true },
  { item: 'Fire Action Notices', provided: true },
  { item: 'CCTV', provided: true },
  { item: 'Intruder Alarm', provided: true },
  { item: 'First Aid Kit', provided: false },
  { item: 'Defibrillator (AED)', provided: false, note: 'nearest public AED approximately 100 metres away' },
];

const fullSignageList = [
  'No outdoor footwear',
  'CCTV in operation',
  'No eating or drinking',
  'Shower before entering the pool',
  'Hand sanitising notice',
  'Fire action notices',
  'Pool opening hours',
  'Building alarm reminder',
  'Deep end depth marker',
  'No running',
  'Lifebuoy for emergency use only',
  'Cross contamination warning',
  'Fire door signage',
  'Emergency exit signage',
];

const areasForReview = [
  'Suitability of operating the pool as an unsupervised residential facility.',
  'Adequacy of existing rescue equipment.',
  'Adequacy of current signage.',
  'First aid provision.',
  'Requirement for an on-site Automated External Defibrillator (AED).',
  'Development of an Emergency Action Plan (EAP).',
  'Recommended operating procedures for residents.',
  'Water quality management procedures.',
  'Emergency response arrangements.',
  'Any additional recommendations considered appropriate under current guidance and recognised best practice.',
];

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-300 break-inside-avoid">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <Image src={src} alt={alt} fill sizes="400px" className="object-cover" />
      </div>
      <figcaption className="border-t border-slate-200 px-2 py-1.5 text-[11px] leading-tight text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
}

function Section({
  number,
  title,
  children,
  breakBefore = true,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  breakBefore?: boolean;
}) {
  return (
    <section className={`space-y-3 ${breakBefore ? 'break-before-page' : ''}`}>
      <h2 className="text-lg font-bold text-slate-950">
        {number}. {title}
      </h2>
      <div className="space-y-3 text-[13px] leading-6 text-slate-800">{children}</div>
    </section>
  );
}

export default function RlssReportPage() {
  return (
    <article
      className="mx-auto w-full max-w-[52rem] space-y-8 px-3 pb-16 pt-4 text-slate-900 print:px-0"
      style={{ backgroundColor: '#ffffff' }}
    >
      <header className="space-y-1 border-b border-slate-300 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Not for public distribution — prepared for independent review
        </p>
        <h1 className="text-2xl font-bold text-slate-950">
          James Square — Pool Operations &amp; Preliminary Safety Pack
        </h1>
        <p className="text-sm text-slate-600">
          Prepared to support an independent safety review by the Royal Life Saving Society (RLSS)
        </p>
      </header>

      <Section number="1" title="Purpose of this Document" breakBefore={false}>
        <p>
          This document has been prepared to provide an overview of the James Square residential swimming pool and
          leisure facilities in advance of an independent safety review by the Royal Life Saving Society (RLSS).
        </p>
        <p>
          The intention is to provide the assessor with sufficient background information regarding the building,
          pool operation, access arrangements, existing safety measures and current management procedures to assist
          with an initial desktop assessment before any site visit.
        </p>
        <p>
          Where appropriate, photographs have been included throughout this document to demonstrate the existing
          layout, equipment and safety signage currently installed within the facility.
        </p>
        <p>This document is intended to support, rather than replace, a formal professional risk assessment.</p>
      </Section>

      <Section number="2" title="Facility Overview">
        <p>
          James Square is a private residential development located in Edinburgh consisting of 103 residential
          properties. Residents have access to a communal indoor leisure facility comprising a heated indoor
          swimming pool, infrared sauna, small gymnasium, male changing room, female changing room, shower facilities
          and toilet facilities.
        </p>
        <p>
          The swimming pool measures approximately 11 metres long by 4.5 metres wide. Water depth varies from 0.80
          metres at the shallow end to 1.70 metres at the deep end. The water temperature is normally maintained
          between 28°C and 30°C using an air source heat pump installed during 2025.
        </p>
        <p>
          Water chemistry is managed using an automated Wallace &amp; Tiernan dosing system which continuously
          monitors chlorine and pH levels. Daily readings are recorded by the caretaker and manual water testing is
          carried out weekly to verify the automated monitoring system. The swimming pool plant is maintained by
          Aquatech, who installed the majority of the pool equipment and provide specialist servicing and technical
          support when required.
        </p>
      </Section>

      <Section number="3" title="Pool Operation">
        <p>
          The facility is intended solely for residents of James Square and their invited guests. The swimming pool
          is not open to the general public. Use of the facility is generally low, with an estimated fewer than 25
          individual users each week.
        </p>
        <p>
          An online booking system was introduced during the COVID-19 pandemic to manage occupancy and reduce
          overcrowding. The booking system remains in operation and residents are encouraged to reserve the facility
          before use. Although the booking system is not technically enforced, residents generally cooperate and the
          facility is normally occupied by a single household at any one time.
        </p>
        <Figure
          src="/images/pool/01-entrance-hallway.jpeg"
          alt="Booking information and QR code displayed at the entrance"
          caption="James Square booking information and QR code, displayed at the entrance"
        />
      </Section>

      <Section number="4" title="Access Control">
        <p>Access to the swimming pool is controlled through several security measures.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Residents must first gain access to the James Square development using their property key.</li>
          <li>The pool building is then accessed through an external entrance secured by a combination keypad.</li>
          <li>Entry into the main pool hall is controlled using an electronic proximity fob system.</li>
          <li>Only authorised residents possess active fobs.</li>
          <li>Access permissions can be added or removed where necessary.</li>
          <li>
            The plant room is secured behind two locked doors and access is restricted to the caretaker and
            committee members for maintenance or emergency purposes.
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-3">
          <Figure
            src="/images/pool/02-exterior-entrance-door.jpeg"
            alt="External entrance to the pool building with combination keypad lock"
            caption="External entrance to the pool building, with combination keypad lock"
          />
          <Figure
            src="/images/pool/01-entrance-hallway.jpeg"
            alt="Entrance hallway and signage, including notice that visits are recorded by swipe card and CCTV"
            caption="Entrance hallway and signage — visits are recorded by swipe card and CCTV"
          />
        </div>
      </Section>

      <Section number="5" title="Supervision">
        <p>The swimming pool operates as an unsupervised residential facility. No qualified lifeguard is present during normal operation.</p>
        <p>
          A live CCTV feed is available within the caretaker&rsquo;s office; however, this is not continuously
          monitored and should not be regarded as providing active supervision. The caretaker is normally on site
          Monday to Friday between approximately 0600 and 1400 hours but is not responsible for supervising pool
          users during swimming activities.
        </p>
        <p>
          Residents are therefore expected to exercise personal responsibility and comply with the pool rules
          displayed throughout the facility. Children under the age of 16 must be accompanied by a responsible adult
          at all times.
        </p>
      </Section>

      <Section number="6" title="Security Measures">
        <p>Security within the leisure facility includes:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Electronic fob-controlled access</li>
          <li>External keypad entry</li>
          <li>Two internal CCTV cameras covering the pool hall</li>
          <li>Motion detection system</li>
          <li>Intruder alarm activated after 2300 hours</li>
          <li>Automatic alarm activation if movement is detected after approximately 2315 hours</li>
        </ul>
        <p>
          One CCTV camera monitors the main entrance and deep end of the swimming pool. The second camera provides
          full coverage of the swimming pool itself. Residents are advised that the pool closes at 2300 hours and
          signage reminds users to vacate the premises before the alarm system becomes active.
        </p>
        <Figure
          src="/images/pool/Pool-entrance.png"
          alt="Fire alarm call point and 11pm vacate / alarm reminder notice near the pool hall exit"
          caption="Fire alarm call point and 11pm vacate / alarm reminder notice, near the pool hall exit"
        />
        <p className="text-xs italic text-slate-500">
          Dedicated close-up photographs of the CCTV cameras, motion sensor and fob-controlled exit release button
          are not yet available and should be added before circulation to the assessor.
        </p>
      </Section>

      <Section number="7" title="Water Quality Management">
        <p>Water quality is managed using an automated Wallace &amp; Tiernan dosing and monitoring system. The system continuously monitors free chlorine and pH.</p>
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-50">
              <th className="px-3 py-1.5 font-semibold">Parameter</th>
              <th className="px-3 py-1.5 font-semibold">Target Range</th>
            </tr>
          </thead>
          <tbody>
            {waterQualityRanges.map((row) => (
              <tr key={row.parameter} className="border-b border-slate-200">
                <td className="px-3 py-1.5">{row.parameter}</td>
                <td className="px-3 py-1.5">{row.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Water quality readings are recorded daily. Weekly manual testing is also undertaken using independent
          testing equipment to verify that the automated monitoring system remains correctly calibrated. Specialist
          maintenance of the dosing equipment is provided by Aquatech and equipment is used predominantly by the
          caretaker or appointed Myreside Management cleaning team leader when the caretaker is absent.
        </p>
        <Figure
          src="/images/pool/IMG_4149.jpeg"
          alt="Pool water filtration and dosing plant"
          caption="Wallace & Tiernan Ezetrol touch automated dosing and monitoring controller area"
        />
      </Section>

      <Section number="8" title="Cleaning & Maintenance">
        <p>The leisure facility is cleaned each weekday morning by cleaning contractors appointed by Myreside Management.</p>
        <p>The caretaker also undertakes routine visual inspections of the facility and monitors plant operation during normal working hours.</p>
        <p>Specialist servicing of pool equipment is undertaken by Aquatech when required.</p>
      </Section>

      <Section number="9" title="Emergency Equipment">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-50">
              <th className="px-3 py-1.5 font-semibold">Equipment</th>
              <th className="px-3 py-1.5 font-semibold">Provision</th>
            </tr>
          </thead>
          <tbody>
            {emergencyEquipment.map((row) => (
              <tr key={row.item} className="border-b border-slate-200">
                <td className="px-3 py-1.5">
                  {row.item}
                  {row.note ? <span className="block text-xs text-slate-500">{row.note}</span> : null}
                </td>
                <td className="px-3 py-1.5">{row.provided ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          The nearest publicly accessible Automated External Defibrillator (AED) is located outside St Bride&rsquo;s
          Community Centre on Orwell Terrace, approximately 100 metres from the pool building. A second publicly
          accessible AED is located at Dalry Leisure Centre on Caledonian Crescent.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Figure
            src="/images/pool/Pool-entrance.png"
            alt="Lifebuoy at the main entrance"
            caption="Lifebuoy — main entrance"
          />
          <Figure
            src="/images/pool/Pool-facing-south.png"
            alt="Lifebuoy positioned near the pool"
            caption="Lifebuoy — positioned near the pool"
          />
        </div>
      </Section>

      <Section number="10" title="Emergency Procedures">
        <p>In the event of a medical emergency, residents are expected to contact the emergency services by dialling 999.</p>
        <p>Emergency exits, fire alarm call points and fire action notices are provided throughout the building.</p>
        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 font-medium text-amber-900">
          At the time of writing, no formal written Emergency Action Plan (EAP) has been produced specifically for
          the swimming pool facility. The production of a documented Emergency Action Plan is considered an area for
          independent review and guidance.
        </p>
      </Section>

      <Section number="11" title="Existing Safety Signage">
        <p>Safety signage is installed throughout the leisure facility to encourage safe use of the swimming pool and associated facilities. Signage currently includes:</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 list-disc pl-5">
          {fullSignageList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Photographs of signage currently documented are included below; the remainder are in place but not yet individually photographed.</p>
        <div className="grid grid-cols-3 gap-3">
          <Figure src="/images/pool/01-entrance-hallway.jpeg" alt="Entrance signage" caption="Entrance signage: no eating/drinking, CCTV in operation, no outdoor footwear, hygiene notice" />
          <Figure src="/images/pool/Pool-entrance.png" alt="Lifebuoy for emergency use only signage" caption="Lifebuoy for emergency use only, and fire call point" />
          <Figure src="/images/pool/Pool-facing-south.png" alt="No diving sign" caption="No diving sign, displayed poolside" />
          <Figure src="/images/pool/05-sauna-entrance-door.jpeg" alt="Hygiene and single-household changing room notice" caption="Hygiene reminder and single-household changing room notice" />
          <Figure src="/images/pool/03-gym-facing-south.jpeg" alt="Cross contamination warning" caption="Hygiene and cross-contamination warning notices" />
        </div>
      </Section>

      <Section number="12" title="Historical Incidents">
        <p className="font-semibold">Broken Glass Incident</p>
        <p>
          Several years ago, glass was broken within the pool hall. As a precaution the swimming pool was completely
          drained, professionally cleaned and recommissioned before reopening. No injuries were reported.
        </p>
        <p className="font-semibold">Plant Room Electrical Failure (2026)</p>
        <p>
          During 2026, a leak within the plant room resulted in water entering electrical equipment, causing failure
          of the dehumidification system. Although the dehumidifier was subsequently repaired, the prolonged period
          of elevated humidity resulted in damage to sections of the ceiling, decorative cornicing and internal
          finishes. The swimming pool has remained temporarily closed whilst surveys, investigations and repair
          options are considered. This incident forms part of the ongoing refurbishment project and is not
          considered representative of normal pool operation.
        </p>
        <Figure
          src="/images/pool/08-ceiling-damage.jpeg"
          alt="Ceiling finishes damaged following the 2026 plant room electrical failure"
          caption="Ceiling finishes requiring repair, following the 2026 plant room electrical failure"
        />
      </Section>

      <Section number="13" title="Existing Rules">
        <p>The full Pool &amp; Recreation Area Health &amp; Safety Rules are displayed at the main entrance. These rules cover:</p>
        <ul className="list-disc space-y-0.5 pl-5">
          <li>Supervision of children</li>
          <li>Maximum occupancy</li>
          <li>Hygiene requirements</li>
          <li>Prohibited activities</li>
          <li>Alcohol and smoking</li>
          <li>Appropriate footwear</li>
          <li>Appropriate clothing</li>
          <li>Safe use of the sauna</li>
          <li>Responsibility of residents</li>
          <li>Protection of emergency equipment</li>
          <li>Behaviour within the facility</li>
        </ul>
      </Section>

      <Section number="14" title="Areas for Independent Review">
        <p>James Square welcomes independent advice from the Royal Life Saving Society regarding the continued safe operation of the facility. Particular areas where guidance would be appreciated include:</p>
        <ul className="list-disc space-y-0.5 pl-5">
          {areasForReview.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
    </article>
  );
}
