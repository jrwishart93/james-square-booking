import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Ban,
  Building2,
  CalendarCheck,
  Car,
  ClipboardCheck,
  Clock,
  DoorOpen,
  Flame,
  KeyRound,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Recycle,
  ShieldAlert,
  Sofa,
  Sparkles,
  Trash2,
  Users,
  Waves,
  Wrench,
} from 'lucide-react';
import { COMMUNITY_WHATSAPP_URL } from '@/lib/community';
import SectionNav from './_components/SectionNav';
import MoveInChecklist from './_components/MoveInChecklist';
import DeliveryNote from './_components/DeliveryNote';
import Directory from './_components/Directory';
import LocalProjects from './_components/LocalProjects';
import { FacilitiesStatus, FireActionBlock, LegacyHashRedirect } from './_components/ClientBits';
import { Callout, Card, Fact, Section, glass, pillButton, primaryButton, secondaryButton } from './_components/ui';

const NAV = [
  { id: 'start', label: 'New here?' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'facilities', label: 'Pool, gym & sauna' },
  { id: 'parking', label: 'Parking' },
  { id: 'bins', label: 'Bins' },
  { id: 'parcels', label: 'Parcels' },
  { id: 'fire', label: 'Fire safety' },
  { id: 'around', label: 'Around Dalry' },
  { id: 'projects', label: 'Local projects' },
];

const MYRESIDE_PHONE = '0131 466 3001';
const MYRESIDE_EMAIL = 'info@myreside-management.co.uk';
const OFFICE_EMAIL = 'office@james-square.com';

const heroGhost = `${pillButton} border border-white/30 bg-white/10 text-white hover:bg-white/20`;

const linkClass = 'font-medium underline underline-offset-2';

export default function LivingHerePage() {
  return (
    <div className="relative space-y-14 pb-16 sm:space-y-20">
      <LegacyHashRedirect />

      {/* ---------------- Hero ---------------- */}
      <header className="relative overflow-hidden rounded-3xl">
        <Image
          src="/images/buildingimages/garden.jpg"
          alt=""
          fill
          priority
          sizes="(min-width:1152px) 1152px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" aria-hidden />
        <div className="relative px-5 py-14 text-white sm:px-10 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Living here</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your guide to living at James Square
          </h1>
          <p className="mt-4 max-w-xl text-white/85">
            Everything owners and tenants need day to day: who to contact, getting into the pool, parking, bins,
            parcels and what&rsquo;s nearby.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <a href="#start" className={`${pillButton} bg-white text-neutral-900 hover:bg-neutral-200`}>
              <ClipboardCheck className="h-4 w-4" aria-hidden /> New here? Start here
            </a>
            <a
              href="#contacts"
              className={heroGhost}
            >
              <Phone className="h-4 w-4" aria-hidden /> Key contacts
            </a>
            <Link
              href="/book"
              className={heroGhost}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden /> Book facilities
            </Link>
          </div>
        </div>
      </header>

      <SectionNav items={NAV} />

      {/* ---------------- New here ---------------- */}
      <Section
        id="start"
        eyebrow="Moving in"
        title="New here? Start with this"
        intro="A checklist for your first few weeks. Tick items off as you go; your progress is saved on this device."
        icon={ClipboardCheck}
      >
        <Card>
          <MoveInChecklist />
        </Card>
      </Section>

      {/* ---------------- Contacts ---------------- */}
      <Section
        id="contacts"
        eyebrow="Who to contact"
        title="Key contacts and emergencies"
        intro="Who to call for what, and what to do when something goes wrong."
        icon={Phone}
      >
        <div className="mb-4">
          <Callout tone="warning" title="In an emergency">
            <p>
              If there is a fire, a risk to life or a crime in progress, call <strong>999</strong> first.
            </p>
          </Callout>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Factor */}
          <Card className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                  Factor
                </p>
                <h3 className="mt-1 text-lg font-semibold">Myreside Management</h3>
              </div>
              <div className="relative h-10 w-20 shrink-0">
                <Image
                  src="/images/logo/myreside-logo-removebg-preview.png"
                  alt="Myreside Management logo"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Manages the development since 1 February 2026: communal repairs, cleaning, landscaping, the pool, gym
              and sauna, and owners&rsquo; accounts.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[color:var(--text-muted)]" aria-hidden />
                <a href="tel:+441314663001" className={linkClass}>
                  {MYRESIDE_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[color:var(--text-muted)]" aria-hidden />
                <a href={`mailto:${MYRESIDE_EMAIL}`} className={`${linkClass} break-all`}>
                  {MYRESIDE_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2 text-[color:var(--text-muted)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                3 Dalkeith Road Mews, Edinburgh EH16 5GA
              </li>
            </ul>
            <p className="mt-3 text-xs text-[color:var(--text-muted)]">
              The same number is advertised for out-of-hours emergencies, but some residents have had trouble
              getting through after hours.
            </p>
            <div className="mt-auto pt-4">
              <Link href="/myreside" className={secondaryButton}>
                Owners: more about Myreside <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Card>

          {/* Caretaker */}
          <Card className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              Caretaker
            </p>
            <h3 className="mt-1 text-lg font-semibold">Jimmy</h3>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Looks after the pool plant and communal areas, and can help replace or buy key fobs and main entrance
              door keys.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
                <span>Monday to Friday, early morning until early afternoon. Hours vary.</span>
              </li>
              <li className="flex gap-2">
                <DoorOpen className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
                <span>
                  Knock at the office door at <strong>No. 65</strong>, between the main entrance and the path to the
                  Telfer Subway. If there&rsquo;s no answer, leave a note.
                </span>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
                <span>
                  Or email{' '}
                  <a href={`mailto:${OFFICE_EMAIL}`} className={linkClass}>
                    {OFFICE_EMAIL}
                  </a>
                  . Jimmy will reply when he can.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-[color:var(--text-muted)]">
              Not responsible for problems inside private flats, parcels, or short-term let enquiries.
            </p>
          </Card>

          {/* Community */}
          <Card className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              Neighbours
            </p>
            <h3 className="mt-1 text-lg font-semibold">Community WhatsApp group</h3>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              The most reliable way to raise something urgent out of hours, such as a leak, a door left open or a
              communal light out, and to get advice from other owners and residents.
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-muted)]">
              For an emergency, report it to Myreside <em>and</em> post in the group, so someone is likely to see it
              quickly.
            </p>
            <div className="mt-auto pt-4">
              <a href={COMMUNITY_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Join the group
              </a>
            </div>
          </Card>
        </div>

        {/* Utilities */}
        <div className={`${glass} mt-4 p-5`}>
          <h3 className="font-semibold">Utility and health lines</h3>
          <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <UtilityLine label="Smell gas" number="0800 111 999" tel="08001119999" />
            <UtilityLine label="Power cut" number="105" tel="105" />
            <UtilityLine label="Water supply or leak in the street" number="0800 0778 778" tel="08000778778" note="Scottish Water" />
            <UtilityLine label="Urgent health advice" number="111" tel="111" note="NHS 24" />
          </ul>
          <p className="mt-3 text-xs text-[color:var(--text-muted)]">
            A leak coming from the flat above is usually between you and that flat&rsquo;s owner or tenant. Knock, or
            ask in the WhatsApp group if you don&rsquo;t know who lives there. Tell Myreside if it involves a communal
            pipe or area.
          </p>
        </div>
      </Section>

      {/* ---------------- Facilities ---------------- */}
      <Section
        id="facilities"
        eyebrow="Shared facilities"
        title="Pool, gym and sauna"
        intro="The leisure suite is on the north-west side of James Square. You need a key fob and the door code to get in."
        icon={Waves}
      >
        <FacilitiesStatus />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Finding the entrance</h3>
            <ol className="mt-3 space-y-4 text-sm">
              <Step n={1} title="From inside the building">
                Follow the internal signs to the leisure suite door.
              </Step>
              <Step n={2} title="From outside">
                From the car park, walk towards the main gates. The pool door is under the archway, next to the
                electric gates.
              </Step>
              <Step n={3} title="Open the door">
                Use your key fob and the access code on the keypad.
              </Step>
            </ol>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <PlaceImage src="/images/buildingimages/pool_from_outside.png" alt="The pool entrance under the archway" />
              <PlaceImage src="/images/buildingimages/pool_door.png" alt="The pool entrance door and keypad" />
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold">Getting a fob and the access code</h3>
              <ol className="mt-3 space-y-4 text-sm">
                <Step n={1} title="Ask whoever handed over your flat">
                  Your landlord, letting agent, or the seller or previous resident should pass on the fob and the
                  current code.
                </Step>
                <Step n={2} title="Still stuck?">
                  Contact Jimmy, the caretaker, or Myreside. They can arrange access and replacement fobs.
                </Step>
              </ol>
              <p className="mt-4 text-xs text-[color:var(--text-muted)]">
                The code is never published online. Please don&rsquo;t share it outside James Square.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">Before you go</h3>
              <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                Book a slot, and read the opening hours, pool rules and safety guidance.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/book" className={primaryButton}>
                  <CalendarCheck className="h-4 w-4" aria-hidden /> Book the pool, gym or sauna
                </Link>
                <Link href="/pool-safety" className={secondaryButton}>
                  Hours, rules and safety <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* ---------------- Parking ---------------- */}
      <Section
        id="parking"
        eyebrow="Cars"
        title="Parking"
        intro="Parking inside James Square is for residents only, in their own allocated space."
        icon={Car}
      >
        <Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Fact icon={Car} title="One space per property">
              Every property has one allocated parking space. Spaces are clearly numbered.
            </Fact>
            <Fact icon={KeyRound} title="One gate fob per property">
              Each property is given one fob for the car park gates.
            </Fact>
            <Fact icon={Ban} title="No guest parking">
              There is no visitor parking inside James Square. Don&rsquo;t use anyone else&rsquo;s space unless the
              person entitled to it has given you explicit permission.
            </Fact>
            <Fact icon={MapPin} title="Visitors and extra cars">
              Use Caledonian Crescent and the surrounding streets. Council parking restrictions apply, so check the
              signs.
            </Fact>
          </div>
        </Card>
      </Section>

      {/* ---------------- Bins ---------------- */}
      <Section
        id="bins"
        eyebrow="Waste"
        title="Bins and recycling"
        intro="Bins are collected from James Square twice a week. Please don't overfill them or block the bin chutes."
        icon={Trash2}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <BinCard
            icon={Trash2}
            title="General waste"
            img="/images/buildingimages/waste-bins.jpeg"
            alt="Communal general waste bins in the rear car park"
          >
            Landfill bins are in the rear car park, through the archway. The chutes in blocks 51 and 45 take tied
            sacks only; take large bags to the outdoor bins. Never leave rubbish in stairwells or corridors.
          </BinCard>
          <BinCard
            icon={Recycle}
            title="Recycling"
            img="/images/buildingimages/outside-bins.png"
            alt="Recycling bins on Caledonian Crescent"
          >
            At the front of James Square on Caledonian Crescent, at the corner with Orwell Terrace. Separate bins for
            glass, paper, plastics and cans.
          </BinCard>
          <BinCard
            icon={Sofa}
            title="Bulky items and electricals"
            img="/images/buildingimages/sighthill-waste-image.png"
            alt="Household waste recycling centre"
          >
            Don&rsquo;t leave furniture or large items by the bins. Contact the City of Edinburgh Council to arrange an
            uplift, or take them to the{' '}
            <a
              href="https://www.edinburgh.gov.uk/recycling-3/household-waste-recycling-centres"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              recycling centre at Bankhead Avenue
            </a>
            .
          </BinCard>
        </div>
      </Section>

      {/* ---------------- Parcels ---------------- */}
      <Section
        id="parcels"
        eyebrow="Deliveries"
        title="Parcels"
        intro="There is no concierge and there are no parcel lockers at James Square."
        icon={Package}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <Callout tone="warning" title="Parcels have gone missing from the foyer">
              <p>
                Ask couriers to deliver to your own door, not to leave parcels in the front foyer. Collect anything
                left in communal areas promptly.
              </p>
            </Callout>
            <div className="space-y-4">
              <Fact icon={DoorOpen} title="Foyer open in the mornings">
                Not everyone can get into the foyer, so the cleaning staff keep the door open in the mornings for
                residents to collect parcels left there.
              </Fact>
              <Fact icon={Sparkles} title="A better solution is being discussed">
                Secure parcel storage has been discussed and may be introduced in future.
              </Fact>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold">Delivery note for couriers</h3>
            <p className="mb-4 mt-1 text-sm text-[color:var(--text-muted)]">
              Add this to the delivery instructions in your shopping and courier accounts.
            </p>
            <DeliveryNote />
          </Card>
        </div>
      </Section>

      {/* ---------------- Fire ---------------- */}
      <Section
        id="fire"
        eyebrow="Safety"
        title="Fire safety"
        intro="What to do if there is a fire in James Square, and where to assemble."
        icon={Flame}
      >
        <Card>
          <FireActionBlock />
        </Card>
      </Section>

      {/* ---------------- Around Dalry ---------------- */}
      <Section
        id="around"
        eyebrow="Nearby"
        title="Around Dalry"
        intro="Food, coffee, shops, pharmacies and GP practices within a short walk."
        icon={MapPin}
      >
        <Directory />
      </Section>

      {/* ---------------- Projects ---------------- */}
      <Section
        id="projects"
        eyebrow="Community"
        title="Local projects and getting involved"
        intro="What's happening in the neighbourhood, and how to take part."
        icon={Users}
      >
        <span id="local-projects" aria-hidden />
        <LocalProjects />
      </Section>

      {/* ---------------- Stories ---------------- */}
      <Link
        href="/stories"
        className={`${glass} group flex flex-col gap-3 p-6 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex items-start gap-3">
          <Building2 className="mt-1 h-6 w-6 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
          <div>
            <p className="text-lg font-semibold">Stories from James Square</p>
            <p className="text-sm text-[color:var(--text-muted)]">
              The history of Dalry and James Square, and the winter the waxwings came.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold">
          Read the stories <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>

      <p className="flex items-start gap-2 text-xs text-[color:var(--text-muted)]">
        <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Some photos on this page are illustrations and are being replaced with real photographs. Spotted something
        out of date? Email{' '}
        <a href={`mailto:${OFFICE_EMAIL}`} className="underline">
          {OFFICE_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}

function UtilityLine({ label, number, tel, note }: { label: string; number: string; tel: string; note?: string }) {
  return (
    <li className="flex gap-2">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
      <div>
        <p className="text-[color:var(--text-muted)]">
          {label}
          {note && <span> ({note})</span>}
        </p>
        <a href={`tel:${tel}`} className="text-base font-semibold underline-offset-2 hover:underline">
          {number}
        </a>
      </div>
    </li>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
        {n}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-[color:var(--text-muted)]">{children}</p>
      </div>
    </li>
  );
}

function PlaceImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
      <Image src={src} alt={alt} fill sizes="(min-width:1024px) 280px, 50vw" className="object-cover" />
    </figure>
  );
}

function BinCard({
  icon: Icon,
  title,
  img,
  alt,
  children,
}: {
  icon: LucideIcon;
  title: string;
  img: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`${glass} flex flex-col overflow-hidden`}>
      <div className="relative h-40 w-full">
        <Image src={img} alt={alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Icon className="h-4 w-4" aria-hidden /> {title}
        </h3>
        <p className="text-sm text-[color:var(--text-muted)]">{children}</p>
      </div>
    </article>
  );
}
