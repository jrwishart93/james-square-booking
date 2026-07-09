'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  Beer,
  BellRing,
  Box,
  Camera,
  ChevronDown,
  CigaretteOff,
  Clock,
  Dumbbell,
  DoorOpen,
  Droplets,
  FileText,
  Flame,
  Footprints,
  Heart,
  HeartPulse,
  Info,
  LifeBuoy,
  MapPin,
  Navigation,
  Phone,
  Ruler,
  ShieldCheck,
  ShowerHead,
  Siren,
  Sparkles,
  Thermometer,
  TriangleAlert,
  Users,
  Waves,
  Wind,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

const HERO_IMAGE = '/images/pool/BC0D4867-E841-4F44-B7B8-90030F8D2E6B.jpeg';
const FLOOR_PLAN = '/images/pool/updated-floor-plane-v2.png';

type FacilityState = 'open' | 'restricted' | 'closed';

const STATUS_META: Record<
  FacilityState,
  { label: string; dot: string; ring: string; text: string; chip: string }
> = {
  open: {
    label: 'Open',
    dot: 'bg-emerald-500',
    ring: 'shadow-emerald-500/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
  },
  restricted: {
    label: 'Restricted',
    dot: 'bg-amber-500',
    ring: 'shadow-amber-500/40',
    text: 'text-amber-700 dark:text-amber-300',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-rose-500',
    ring: 'shadow-rose-500/40',
    text: 'text-rose-700 dark:text-rose-300',
    chip: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
  },
};

// Update these three lines whenever a facility status changes.
const facilityStatus: {
  name: string;
  icon: LucideIcon;
  state: FacilityState;
  note: string;
}[] = [
  { name: 'Swimming pool', icon: Waves, state: 'closed', note: 'Temporarily closed pending assessment and further works' },
  { name: 'Gym', icon: Dumbbell, state: 'closed', note: 'Temporarily closed pending assessment and further works' },
  { name: 'Sauna', icon: Flame, state: 'closed', note: 'Temporarily closed pending assessment and further works' },
];

const quickActions: { label: string; href: string; icon: LucideIcon; external?: boolean }[] = [
  { label: 'View Pool Rules', href: '#pool-rules', icon: ShieldCheck },
  { label: 'Emergency Information', href: '#emergency', icon: Siren },
  { label: 'Pool Floor Plan', href: '#pool-overview', icon: MapPin },
  { label: 'Risk Assessment', href: '#documents', icon: FileText },
  { label: 'Pool 3D Model', href: '/pool3d', icon: Box, external: true },
];

type Hotspot = {
  id: string;
  label: string;
  icon: LucideIcon;
  x: number; // percentage across the floor plan
  y: number; // percentage down the floor plan
  tone: string;
  body: string;
};

const hotspots: Hotspot[] = [
  {
    id: 'pool',
    label: 'Swimming pool',
    icon: Waves,
    x: 36,
    y: 47,
    tone: 'from-sky-500 to-cyan-500',
    body: 'Heated indoor pool, approximately 11m × 4.5m. Depth graduates from 0.80m at the shallow end to 1.70m at the deep end. Water is held between 28°C and 30°C.',
  },
  {
    id: 'rescue-pole',
    label: 'Rescue pole',
    icon: Ruler,
    x: 60,
    y: 31,
    tone: 'from-amber-500 to-orange-500',
    body: 'The reach pole is positioned beside the timber seating area between the swimming pool and gym so it can be accessed rapidly during a water-rescue emergency. It lets a rescuer reach someone in difficulty without entering the water themselves.',
  },
  {
    id: 'lifebuoy-1',
    label: 'Lifebuoy (main entrance)',
    icon: LifeBuoy,
    x: 20,
    y: 62,
    tone: 'from-rose-500 to-red-500',
    body: 'One of two lifebuoys. Throw to a casualty in the water so they can stay afloat while help is arranged. For emergency use only.',
  },
  {
    id: 'lifebuoy-2',
    label: 'Lifebuoy (east wall)',
    icon: LifeBuoy,
    x: 54,
    y: 62,
    tone: 'from-rose-500 to-red-500',
    body: 'Second lifebuoy mounted near the pool ladders on the east wall, so a flotation aid is always within easy reach of either end of the pool.',
  },
  {
    id: 'gym',
    label: 'Gymnasium',
    icon: Dumbbell,
    x: 68,
    y: 34,
    tone: 'from-slate-600 to-slate-800',
    body: 'A small gym with cardio and resistance equipment. Users are asked to exercise within their own ability and to wipe equipment down after use.',
  },
  {
    id: 'sauna',
    label: 'Sauna',
    icon: Flame,
    x: 82,
    y: 25,
    tone: 'from-orange-500 to-amber-600',
    body: 'Infrared heated sauna. The control panel is outside the sauna: switch it on before use and switch it off again after leaving the sauna area.',
  },
  {
    id: 'showers',
    label: 'Showers',
    icon: ShowerHead,
    x: 84,
    y: 59,
    tone: 'from-cyan-500 to-sky-600',
    body: 'All users must shower before entering the pool or sauna. This reduces chemical demand on the water and keeps the facility hygienic.',
  },
  {
    id: 'plant',
    label: 'External plant room',
    icon: Wrench,
    x: 10,
    y: 88,
    tone: 'from-indigo-500 to-violet-600',
    body: 'The plant room is not shown inside this pool hall floor plan. It is an external room accessed separately via the caretaker’s office at the front of James Square at Block 65A.',
  },
  {
    id: 'exit',
    label: 'Emergency exit',
    icon: DoorOpen,
    x: 61,
    y: 67,
    tone: 'from-emerald-500 to-green-600',
    body: 'Fire exit for use in a genuine emergency only. It must never be used for routine access or exit, and must be kept clear at all times.',
  },
  {
    id: 'cctv',
    label: 'CCTV cameras',
    icon: Camera,
    x: 60,
    y: 42,
    tone: 'from-slate-500 to-slate-700',
    body: 'There are two CCTV cameras: one to the right/north side of the pool pointing south across the pool hall, and one to the left of the internal entrance monitoring people entering and exiting. CCTV supports security and incident review, but does not imply constant live monitoring.',
  },
];

type GalleryItem = {
  src: string;
  title: string;
  shows: string;
  why: string;
  how: string;
  safety: string;
  icon: LucideIcon;
};

const gallery: GalleryItem[] = [
  {
    src: '/images/pool/Pool-facing-south.png',
    title: 'The heated pool',
    shows: 'The main swimming pool looking south, with the shallow end in the foreground.',
    why: 'The pool is the centrepiece of the leisure facility and the focus of most safety measures.',
    how: 'Used by residents and their guests for swimming. Depth is marked at both ends (0.80m / 1.70m).',
    safety: 'No diving, no running and no jumping. Children under 16 must be accompanied by a responsible adult.',
    icon: Waves,
  },
  {
    src: '/images/pool/03-gym-facing-south.jpeg',
    title: 'The gymnasium',
    shows: 'The compact gym adjacent to the pool hall, with cardio and resistance equipment.',
    why: 'Provides residents with fitness facilities alongside the pool and sauna.',
    how: 'Temporarily closed pending assessment and further works.',
    safety: 'Do not use the gym while it is closed. Report any concerns or faults to the committee.',
    icon: Dumbbell,
  },
  {
    src: '/images/pool/05-sauna-entrance-door.jpeg',
    title: 'Sauna & changing rooms',
    shows: 'The sauna entrance beside the changing room door.',
    why: 'The sauna was originally an electrically heated element sauna. Following misuse, including excessive water being poured over the electrical element, it was replaced with a safer infrared heated sauna.',
    how: 'Temporarily closed pending assessment and further works. When available, use the outside control panel to switch it on before use and off again after leaving the sauna area.',
    safety: 'Do not use the sauna while it is closed. Take care when moving between hot and wet surfaces.',
    icon: Flame,
  },
  {
    src: '/images/pool/15-life-buoy-ring.jpeg',
    title: 'Poolside lifebuoy',
    shows: 'A ring lifebuoy mounted on the pool hall wall.',
    why: 'A lifebuoy is the first-line water-rescue aid, keeping a casualty afloat until help arrives.',
    how: 'Throw it to a person in difficulty in the water, then call for help.',
    safety: 'For genuine emergencies only — it must never be removed or played with.',
    icon: LifeBuoy,
  },
  {
    src: '/images/pool/31-chlorine-and-pH-monitor.jpeg',
    title: 'Automated dosing controller',
    shows: 'The Wallace & Tiernan chlorine and pH dosing and monitoring controller.',
    why: 'Safe, clean water depends on chlorine and pH being kept within tight ranges.',
    how: 'Continuously measures and doses the water; readings are logged daily and checked manually weekly.',
    safety: 'Target ranges: pH 7.40–7.80 and free chlorine 0.80–4.30 ppm. Serviced by Aquatech.',
    icon: Droplets,
  },
  {
    src: '/images/pool/32-air-source-heatpump-to-heat-pool.jpeg',
    title: 'Air source heat pump',
    shows: 'The air source heat pump installed in 2025 to heat the pool water.',
    why: 'Keeps the water at a comfortable, consistent 28–30°C efficiently.',
    how: 'Extracts heat from outside air and transfers it to the pool circulation system.',
    safety: 'Part of the restricted plant — maintained by specialist contractors only.',
    icon: Thermometer,
  },
  {
    src: '/images/pool/22-dehumidifier-ventilation-control-unit.jpeg',
    title: 'Ventilation & dehumidification',
    shows: 'The ventilation and dehumidification control unit for the pool hall.',
    why: 'Controls humidity to protect the building fabric and keep the air comfortable.',
    how: 'Heats and manages the pool hall air to reduce condensation and prevent moisture building up on windows, walls and cold surfaces.',
    safety: 'The motherboard was damaged at the same time as the electrical fire in March 2026 and required replacement. The system has now been repaired and is working again.',
    icon: Wind,
  },
  {
    src: '/images/pool/20-fire-door.jpeg',
    title: 'Fire exit',
    shows: 'The emergency fire exit door with break-glass release and signage.',
    why: 'Provides a rapid, protected escape route in the event of fire.',
    how: 'Used only in a genuine emergency; the release is operated to open the door.',
    safety: 'Keep the route clear at all times. Never use it for routine access or exit.',
    icon: DoorOpen,
  },
  {
    src: '/images/pool/18-cctc-camera-1.jpeg',
    title: 'CCTV coverage',
    shows: 'One of the CCTV cameras in the pool hall.',
    why: 'Supports security and incident review without replacing personal supervision.',
    how: 'One camera is to the right/north side of the pool and points south across the pool hall. A second camera is to the left of the internal entrance and monitors people entering and exiting.',
    safety: 'CCTV does not imply constant live monitoring.',
    icon: Camera,
  },
];

type RuleGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  tone: string;
  points: string[];
};

const ruleGroups: RuleGroup[] = [
  {
    id: 'supervision',
    title: 'Supervision',
    icon: Users,
    tone: 'from-sky-500 to-cyan-500',
    points: [
      'This is an unsupervised facility with no lifeguard on duty at any time.',
      'Owners are responsible for the health and safety of anyone they bring in.',
      'CCTV exists but is not continuously monitored and is not active supervision.',
    ],
  },
  {
    id: 'swimming',
    title: 'Swimming',
    icon: Waves,
    tone: 'from-cyan-500 to-blue-500',
    points: [
      'No diving and no jumping into the pool.',
      'No running in the pool or leisure area.',
      'No ball games, airbeds or similar items in the pool.',
    ],
  },
  {
    id: 'footwear',
    title: 'Footwear',
    icon: Footprints,
    tone: 'from-amber-500 to-orange-500',
    points: [
      'Outdoor footwear must be removed before entering the area.',
      'Shoe covers are provided at the entrance.',
      'Swimming or sports attire must be worn at all times.',
    ],
  },
  {
    id: 'alcohol',
    title: 'Alcohol & glass',
    icon: Beer,
    tone: 'from-rose-500 to-red-500',
    points: [
      'No alcohol is to be consumed in the recreation area.',
      'Glass and other breakable vessels are strictly prohibited.',
      'No eating or drinking in the pool hall.',
    ],
  },
  {
    id: 'smoking',
    title: 'Smoking',
    icon: CigaretteOff,
    tone: 'from-slate-500 to-slate-700',
    points: ['Smoking is strictly prohibited throughout the recreation area.'],
  },
  {
    id: 'children',
    title: 'Children',
    icon: Baby,
    tone: 'from-violet-500 to-purple-500',
    points: [
      'No unaccompanied children under 16 are permitted.',
      'Children under 16 must be accompanied by a responsible adult at all times.',
      'A maximum of six people from any one flat may use the facilities at once.',
    ],
  },
  {
    id: 'hygiene',
    title: 'Hygiene',
    icon: ShowerHead,
    tone: 'from-teal-500 to-emerald-500',
    points: [
      'Shower before entering the pool or sauna.',
      'Clean surfaces before and after use to avoid cross-contamination.',
      'No animals are allowed in the facility.',
    ],
  },
  {
    id: 'gym',
    title: 'Gym',
    icon: Dumbbell,
    tone: 'from-indigo-500 to-blue-600',
    points: [
      'Use equipment within your own ability.',
      'Keep the area clear and tidy.',
      'Report any faulty equipment to the committee.',
    ],
  },
  {
    id: 'sauna',
    title: 'Sauna',
    icon: Flame,
    tone: 'from-orange-500 to-amber-600',
    points: [
      'The sauna is temporarily closed pending assessment and further works.',
      'When available, switch the sauna on from the outside control panel before use and switch it off again after leaving the sauna area.',
      'Keep noise to a reasonable level, as anywhere in the development.',
    ],
  },
];

type EmergencyCard = {
  title: string;
  icon: LucideIcon;
  accent: string;
  steps: string[];
};

const emergencyCards: EmergencyCard[] = [
  {
    title: 'Emergency services',
    icon: Phone,
    accent: 'from-rose-600 to-red-600',
    steps: [
      'Call 999 for any serious medical, fire or water emergency.',
      'Give the address: James Square leisure facility, Edinburgh.',
      'Stay with the casualty and send someone to guide responders in.',
    ],
  },
  {
    title: 'Fire',
    icon: Flame,
    accent: 'from-orange-600 to-red-600',
    steps: [
      'Raise the alarm at the nearest fire call point.',
      'Leave via the nearest exit — do not stop to collect belongings.',
      'Call 999 once safely outside and do not re-enter.',
    ],
  },
  {
    title: 'Water rescue',
    icon: LifeBuoy,
    accent: 'from-sky-600 to-cyan-600',
    steps: [
      'Shout for help and throw a lifebuoy or reach with the pole.',
      'Do not enter the water unless absolutely necessary.',
      'Once out, keep the casualty warm and call 999 if needed.',
    ],
  },
  {
    title: 'Electrical emergency',
    icon: Zap,
    accent: 'from-amber-500 to-yellow-600',
    steps: [
      'Do not touch anyone in contact with a live source.',
      'Call 999 and keep everyone clear of the affected area.',
      'Report the incident to the caretaker or committee as soon as it is safe.',
    ],
  },
  {
    title: 'First aid',
    icon: HeartPulse,
    accent: 'from-emerald-600 to-green-600',
    steps: [
      'Assess the scene for danger before approaching.',
      'There is currently no first aid kit on site — call 999 for anything serious.',
      'Reassure the casualty and monitor their condition until help arrives.',
    ],
  },
  {
    title: 'CPR',
    icon: Heart,
    accent: 'from-pink-600 to-rose-600',
    steps: [
      'If unresponsive and not breathing normally, call 999 immediately.',
      'Start chest compressions: 30 compressions to 2 rescue breaths.',
      'Send someone for the nearest AED (see below) and continue until help arrives.',
    ],
  },
];

type EquipmentItem = {
  name: string;
  icon: LucideIcon;
  src: string;
  description: string;
  purpose: string;
  when: string;
};

const equipment: EquipmentItem[] = [
  {
    name: 'Lifebuoy',
    icon: LifeBuoy,
    src: '/images/pool/15-life-buoy-ring.jpeg',
    description: 'Two ring lifebuoys mounted on the pool hall walls.',
    purpose: 'Provides buoyancy to keep a casualty afloat during a water rescue.',
    when: 'Throw to anyone in difficulty in the water. Emergency use only.',
  },
  {
    name: 'Rescue pole',
    icon: Ruler,
    src: '/images/pool/27-lifebouy-number2-placement-near-ladders.jpeg',
    description: 'A reach pole stored poolside near the ladders.',
    purpose: 'Lets a rescuer reach a swimmer without entering the water.',
    when: 'Extend to a casualty who is close enough to grab it.',
  },
  {
    name: 'Fire exit',
    icon: DoorOpen,
    src: '/images/pool/20-fire-door.jpeg',
    description: 'Dedicated fire exit with break-glass release.',
    purpose: 'Provides a protected escape route from the pool hall.',
    when: 'In a genuine fire or emergency evacuation only.',
  },
  {
    name: 'Fire alarm',
    icon: BellRing,
    src: '/images/pool/14-11pm-warning-sign-and-fire-alarm.jpeg',
    description: 'Fire alarm call points with fire action notices displayed nearby.',
    purpose: 'Raises the alarm to warn everyone in the building.',
    when: 'Activate immediately on discovering a fire.',
  },
  {
    name: 'CCTV',
    icon: Camera,
    src: '/images/pool/18-cctc-camera-1.jpeg',
    description: 'Two CCTV cameras cover the pool hall: one on the right/north side pointing south across the pool, and one to the left of the internal entrance.',
    purpose: 'Supports security and incident review.',
    when: 'Does not imply constant live monitoring and is not a substitute for personal supervision.',
  },
];

type OperationTopic = {
  title: string;
  icon: LucideIcon;
  summary: string;
  detail: string;
};

const operationTopics: OperationTopic[] = [
  {
    title: 'Heating',
    icon: Thermometer,
    summary: 'Water held at 28–30°C by an air source heat pump.',
    detail:
      'An air source heat pump installed in 2025 keeps the water at a comfortable, consistent temperature efficiently, drawing heat from the outside air.',
  },
  {
    title: 'Filtration',
    icon: Droplets,
    summary: 'Water is continuously circulated and filtered.',
    detail:
      'Pool water is drawn through a filtration and circulation system that removes debris and keeps the water clear before it is returned to the pool.',
  },
  {
    title: 'Plant room',
    icon: Wrench,
    summary: 'External room accessed separately via Block 65A.',
    detail:
      'The plant room is not covered by the pool hall floor plan and should not be treated as being inside the pool hall. It is an external room accessed via the caretaker’s office at the front of James Square at Block 65A.',
  },
  {
    title: 'Water testing',
    icon: ShieldCheck,
    summary: 'Automated dosing, logged daily, checked weekly.',
    detail:
      'A Wallace & Tiernan system continuously monitors and doses free chlorine and pH. Readings are recorded daily and verified by independent manual testing each week.',
  },
  {
    title: 'Ventilation',
    icon: Wind,
    summary: 'Heats and manages air to reduce condensation.',
    detail:
      'The pool hall uses a ventilation and dehumidification system which heats and manages the air to reduce condensation and prevent moisture building up on windows, walls and cold surfaces. The motherboard was damaged at the same time as the electrical fire in March 2026 and required replacement. The system has now been repaired and is working again.',
  },
];

const documents: { title: string; icon: LucideIcon }[] = [
  { title: 'Risk Assessment', icon: TriangleAlert },
  { title: 'Pool Operating Procedure', icon: FileText },
  { title: 'Emergency Action Plan', icon: Siren },
  { title: 'Maintenance Records', icon: Wrench },
  { title: 'Inspection Reports', icon: ShieldCheck },
  { title: 'Committee Updates', icon: Users },
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'How deep is the pool?',
    a: 'The pool graduates from 0.80m at the shallow end to 1.70m at the deep end, and is approximately 11m long by 4.5m wide. Depth markers are displayed at both ends.',
  },
  {
    q: 'Can guests use the facilities?',
    a: 'Yes. The facilities are for residents and their invited guests only. Owners remain responsible for the health and safety of anyone they bring in, and a maximum of six people per flat may use the facilities at once.',
  },
  {
    q: 'What happens during an emergency?',
    a: 'Call 999 for anything serious. Use the lifebuoys or reach pole for a water rescue, raise the alarm at a fire call point for a fire, and keep clear of anyone in contact with a live electrical source. The nearest AED is at St Bride’s Community Centre, roughly 100m away.',
  },
  {
    q: 'How do I report a fault?',
    a: 'Report any fault or damage to the committee so it can be logged and passed to the caretaker or a contractor. Anyone causing damage may be asked to cover the cost of repair or replacement.',
  },
  {
    q: 'Who maintains the pool?',
    a: 'The facility is cleaned each weekday by contractors appointed by Myreside Management. The caretaker carries out routine checks, and specialist servicing of the pool plant is provided by Aquatech.',
  },
];

const futureItems = [
  'Inspection reports',
  'Maintenance logs',
  'Refurbishment updates',
  'Operating manuals',
  'Training material',
  'Emergency documentation',
];

const AED_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=St+Bride%27s+Community+Centre+Orwell+Terrace+Edinburgh&travelmode=walking';

/* -------------------------------------------------------------------------- */
/*  Motion helpers                                                            */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-300/20 dark:bg-sky-300/10 dark:text-sky-200">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 id={id} className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */

function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        >
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-white/95 shadow-2xl shadow-slate-950/40 dark:bg-slate-900/95"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-200"
              aria-label="Close"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main page                                                                 */
/* -------------------------------------------------------------------------- */

export default function PoolSafetyClient() {
  const reduce = useReducedMotion();
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [openRule, setOpenRule] = useState<string | null>(null);
  const [openOp, setOpenOp] = useState<string | null>('Heating');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-16 pb-20 sm:space-y-20">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:mx-0 lg:rounded-[2.5rem]">
        <div className="relative min-h-[560px] w-full sm:min-h-[600px]">
          <Image
            src={HERO_IMAGE}
            alt="The James Square residents’ swimming pool"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_45%)]" />

          <div className="relative z-10 flex min-h-[560px] flex-col justify-end px-5 py-10 sm:min-h-[600px] sm:px-10 sm:py-14 lg:px-14">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                James Square Leisure Facilities
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Pool Safety &amp; Operations Centre
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">
                Current safety and operations information for the James Square swimming pool, gym and sauna.
                All three facilities are temporarily closed pending assessment and further works.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-2.5 sm:gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
            >
              {quickActions.map((action) => {
                const Icon = action.icon;
                const content = (
                  <>
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </>
                );
                const cls =
                  'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-200/70';
                return (
                  <motion.div key={action.label} variants={fadeUp}>
                    {action.external ? (
                      <Link href={action.href} className={cls}>
                        {content}
                      </Link>
                    ) : (
                      <a href={action.href} className={cls}>
                        {content}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Facility status */}
      <section aria-labelledby="status-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="status-heading"
            eyebrow="Live status"
            title="Current facility status"
            description="The swimming pool, gym and sauna are temporarily closed pending assessment and further works. This page will be updated as the refurbishment progresses."
            icon={Info}
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {facilityStatus.map((facility, i) => {
            const meta = STATUS_META[facility.state];
            const Icon = facility.icon;
            return (
              <Reveal key={facility.name} delay={i}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-cyan-500/15 text-sky-600 dark:text-sky-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className={`relative flex h-3.5 w-3.5 ${''}`}>
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full ${meta.dot} opacity-60 ${
                          reduce ? '' : 'animate-ping'
                        }`}
                      />
                      <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${meta.dot} shadow-lg ${meta.ring}`} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{facility.name}</h3>
                  <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${meta.chip}`}>
                    {meta.label}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{facility.note}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- Interactive plan */}
      <section id="pool-overview" aria-labelledby="overview-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="overview-heading"
            eyebrow="Interactive plan"
            title="Explore the facility"
            description="Tap or hover the markers on the corrected floor plan to learn about the pool, equipment and key safety notes. The plant room is external and is not shown as part of the pool hall layout."
            icon={MapPin}
          />
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/70 p-3 shadow-xl shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Image src={FLOOR_PLAN} alt="Floor plan of the James Square pool area" fill sizes="(min-width: 1024px) 960px, 100vw" className="object-contain" />
              {hotspots.map((spot, i) => {
                const Icon = spot.icon;
                const isActive = activeHotspot?.id === spot.id;
                return (
                  <motion.button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    initial={reduce ? undefined : { opacity: 0, scale: 0 }}
                    whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                    aria-label={spot.label}
                  >
                    <span className={`absolute inset-0 -m-1 rounded-full bg-gradient-to-br ${spot.tone} opacity-70 ${reduce ? '' : 'animate-ping'}`} />
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${spot.tone} text-white shadow-lg ring-2 ring-white/80 transition group-hover:scale-110 dark:ring-slate-900/80 ${
                        isActive ? 'scale-110 ring-4' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900">
                      {spot.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 px-1">
              {hotspots.map((spot) => {
                const Icon = spot.icon;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {spot.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------- Gallery */}
      <section aria-labelledby="gallery-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="gallery-heading"
            eyebrow="Photo gallery"
            title="Inside the facility"
            description="Select any photograph to expand it and read how it fits into the safe operation of the pool."
            icon={Camera}
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.src} delay={i % 3}>
                <button
                  type="button"
                  onClick={() => setActiveImage(item)}
                  className="group relative block h-full w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white text-left shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      unoptimized
                      loading="lazy"
                      sizes="(min-width: 1024px) 31vw, 48vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <span className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                      <h3 className="text-sm font-bold text-white drop-shadow sm:text-base">{item.title}</h3>
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------- Pool rules */}
      <section id="pool-rules" aria-labelledby="rules-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="rules-heading"
            eyebrow="House rules"
            title="Pool &amp; recreation rules"
            description="Grouped by topic — expand any card to see the detail. These rules are displayed at the main entrance."
            icon={ShieldCheck}
          />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ruleGroups.map((group, i) => {
            const Icon = group.icon;
            const isOpen = openRule === group.id;
            return (
              <Reveal key={group.id} delay={i % 3}>
                <div className="h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/60">
                  <button
                    type="button"
                    onClick={() => setOpenRule(isOpen ? null : group.id)}
                    className="flex w-full items-center gap-3 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${group.tone} text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-base font-bold text-slate-950 dark:text-white">{group.title}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 border-t border-slate-200/70 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:text-slate-300">
                          {group.points.map((point) => (
                            <li key={point} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm leading-6 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              <span className="font-bold">This is an unsupervised facility.</span> There is no lifeguard on duty at
              any time. Residents and guests are expected to exercise personal responsibility, and children under 16
              must be accompanied by a responsible adult at all times.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- Emergency */}
      <section id="emergency" aria-labelledby="emergency-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="emergency-heading"
            eyebrow="In an emergency"
            title="Emergency information"
            description="Know what to do before you need it. In any serious emergency, call 999 first."
            icon={Siren}
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i % 3}>
                <div className={`relative h-full overflow-hidden rounded-3xl bg-gradient-to-br ${card.accent} p-[1.5px] shadow-xl shadow-slate-950/10`}>
                  <div className="h-full rounded-[calc(1.5rem-1.5px)] bg-white/95 p-5 dark:bg-slate-900/95">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{card.title}</h3>
                    <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {card.steps.map((step, idx) => (
                        <li key={step} className="flex gap-2.5">
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- AED */}
      <section aria-labelledby="aed-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="aed-heading"
            eyebrow="Defibrillator"
            title="Nearest AED"
            description="There is currently no AED (defibrillator) inside James Square. In a cardiac emergency, call 999 and send someone to the nearest public AED."
            icon={HeartPulse}
          />
        </Reveal>
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
            <div className="relative overflow-hidden rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50 to-white p-6 shadow-lg shadow-rose-950/5 dark:border-rose-300/20 dark:from-rose-950/30 dark:to-slate-900/60 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg">
                  <MapPin className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
                    Nearest AED
                  </p>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">St Bride’s Community Centre</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Orwell Terrace — approximately 100 metres from the pool building, around a two-minute walk.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-200/70 bg-white/70 p-3 dark:border-rose-300/20 dark:bg-slate-900/50">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
                  <Navigation className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <span>Pool</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-rose-300 to-rose-500" />
                    <ArrowRight className="h-4 w-4 text-rose-500" />
                    <span className="h-px flex-1 bg-gradient-to-r from-rose-500 to-rose-300" />
                    <span>St Bride’s</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> ~2 min walk · ~100 m
                  </p>
                </div>
              </div>

              <a
                href={AED_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-rose-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                <Navigation className="h-4 w-4" />
                Walking directions
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                  <MapPin className="h-4 w-4 text-sky-500" /> Second AED
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Dalry Leisure Centre, Caledonian Crescent — a further public defibrillator within the local area.
                </p>
              </div>
              <div className="flex flex-1 items-start gap-3 rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-sm leading-6 text-rose-900 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  <span className="font-bold">Always call 999 first.</span> The 999 operator will tell you where the
                  nearest registered AED is and give the access code if one is needed.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ Emergency kit */}
      <section aria-labelledby="equipment-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="equipment-heading"
            eyebrow="On-site equipment"
            title="Emergency equipment"
            description="The safety equipment available in the facility, what it is for and when to use it."
            icon={LifeBuoy}
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.name} delay={i % 3}>
                <div className="group h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={item.src} alt={item.name} fill unoptimized loading="lazy" sizes="(min-width: 1024px) 31vw, 48vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                      <Icon className="h-3.5 w-3.5" />
                      {item.name}
                    </span>
                  </div>
                  <div className="space-y-2.5 p-5 text-sm leading-6">
                    <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                    <p className="flex gap-2 text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Purpose:</span>
                      {item.purpose}
                    </p>
                    <p className="flex gap-2 rounded-xl bg-sky-50/70 px-3 py-2 text-sky-900 dark:bg-sky-300/10 dark:text-sky-100">
                      <span className="font-bold">When:</span>
                      {item.when}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- Pool operation */}
      <section aria-labelledby="operation-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="operation-heading"
            eyebrow="How it works"
            title="Pool operation"
            description="A brief look at the systems that keep the pool running. Expand any topic for a little more detail."
            icon={Wrench}
          />
        </Reveal>
        <div className="grid gap-3 lg:grid-cols-2">
          {operationTopics.map((topic, i) => {
            const Icon = topic.icon;
            const isOpen = openOp === topic.title;
            return (
              <Reveal key={topic.title} delay={i % 2}>
                <div className="h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                  <button
                    type="button"
                    onClick={() => setOpenOp(isOpen ? null : topic.title)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-cyan-500/15 text-sky-600 dark:text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-base font-bold text-slate-950 dark:text-white">{topic.title}</span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">{topic.summary}</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-slate-200/70 px-5 py-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300">
                          {topic.detail}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------- Documents */}
      <section id="documents" aria-labelledby="documents-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            id="documents-heading"
            eyebrow="Document library"
            title="Documents"
            description="Key operating and safety documents will be published here as the facility is refurbished."
            icon={FileText}
          />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <Reveal key={doc.title} delay={i % 3}>
                <div className="group flex h-full items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500/15 to-slate-700/15 text-slate-600 dark:text-slate-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white">{doc.title}</h3>
                    <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      Coming soon
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------- FAQ */}
      <section aria-labelledby="faq-heading" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading id="faq-heading" eyebrow="Questions" title="Frequently asked questions" icon={Info} />
        </Reveal>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <Reveal key={faq.q} delay={i % 3}>
                <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 text-base font-bold text-slate-950 dark:text-white">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-slate-200/70 px-5 py-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300">
                          {faq.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------- Future improvements */}
      <section aria-labelledby="future-heading" className="scroll-mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-xl shadow-sky-950/5 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                Evolving
              </div>
              <h2 id="future-heading" className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                This page will keep improving
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                The Pool Safety &amp; Operations Centre will continue to evolve as refurbishment works progress.
                Future additions may include:
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {futureItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------------- 3D CTA */}
      <section className="scroll-mt-24">
        <Reveal>
          <Link
            href="/pool3d"
            className="group flex flex-col items-start gap-4 rounded-[2rem] border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg">
                <Box className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                  Explore the interactive 3D model
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  See the full layout of the pool area in three dimensions.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:gap-3 dark:bg-white dark:text-slate-950">
              Open 3D model
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ Hotspot modal */}
      <Modal open={!!activeHotspot} onClose={() => setActiveHotspot(null)} labelledBy="hotspot-title">
        {activeHotspot ? (
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${activeHotspot.tone} text-white shadow-lg`}>
                <activeHotspot.icon className="h-6 w-6" />
              </span>
              <h3 id="hotspot-title" className="text-xl font-bold text-slate-950 dark:text-white">
                {activeHotspot.label}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{activeHotspot.body}</p>
          </div>
        ) : null}
      </Modal>

      {/* ------------------------------------------------------- Gallery modal */}
      <Modal open={!!activeImage} onClose={() => setActiveImage(null)} labelledBy="gallery-title">
        {activeImage ? (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
              <Image src={activeImage.src} alt={activeImage.title} fill unoptimized sizes="(min-width: 640px) 512px, 100vw" className="object-cover" />
            </div>
            <div className="space-y-4 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg">
                  <activeImage.icon className="h-5 w-5" />
                </span>
                <h3 id="gallery-title" className="text-xl font-bold text-slate-950 dark:text-white">
                  {activeImage.title}
                </h3>
              </div>
              <dl className="space-y-3 text-sm leading-6">
                {(
                  [
                    ['What is shown', activeImage.shows],
                    ['Why it matters', activeImage.why],
                    ['How it is used', activeImage.how],
                    ['Safety', activeImage.safety],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-800/50">
                    <dt className="text-xs font-bold uppercase tracking-wide text-sky-600 dark:text-sky-300">{label}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
