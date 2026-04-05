export type BeffectProduct = {
  name: string;
  abv: number;
};

// b.effect product list used for dropdowns and Firestore seeding.
export const B_EFFECT_PRODUCTS: BeffectProduct[] = [
  { name: 'Wānaka Lager', abv: 4.0 },
  { name: 'Pop’n Pils', abv: 4.5 },
  { name: 'Alpine Ale', abv: 4.5 },
  { name: 'Hazy IPA', abv: 5.0 },
  { name: 'Wānaka Light', abv: 2.5 },
  { name: 'Kombucha', abv: 0.0 },
  { name: 'Ginger Beer', abv: 4.0 },
];

export const DEFAULT_LOCATIONS = [
  'Brewery',
  'b.social / Tap Room',
];

export const SCAN_TYPES = [
  'Fill',
  'Deliver',
  'Return',
  'Empty',
  'Maintenance',
  'Lost',
] as const;

export type ScanType = (typeof SCAN_TYPES)[number];

export const RETURN_CONDITIONS = ['Full', 'Empty', 'Damaged'] as const;
