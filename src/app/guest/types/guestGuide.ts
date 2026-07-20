export type GuestIcon =
  | 'wifi' | 'key' | 'car' | 'waves' | 'home' | 'map' | 'phone' | 'checkout'
  | 'clock' | 'users' | 'moon' | 'shield' | 'train' | 'utensils' | 'shopping'
  | 'camera' | 'coffee' | 'thermometer' | 'tv' | 'chef' | 'sparkles' | 'trash'
  | 'briefcase' | 'leaf' | 'alert' | 'message' | 'ambulance' | 'heart';

export interface GuestContactConfig {
  hostPhone?: string;
  whatsapp?: string;
  email?: string;
  emergencyMaintenance?: string;
}

export interface SummaryItem { label: string; value: string; icon: GuestIcon; note?: string; }
export interface InstructionStep { title: string; body: string; placeholder?: boolean; }
export interface GuideItem { title: string; icon: GuestIcon; summary: string; instructions: string[]; image?: string; videoUrl?: string; placeholder?: boolean; }
export interface LocalRecommendation { name: string; category: string; description: string; walkingTime?: string; mapUrl?: string; image?: string; hostPick?: boolean; }
export interface GuestGuideData {
  property: { name: string; heading: string; address: string; locationLine: string; intro: string; heroImage?: string; gardenImage?: string; };
  contacts: GuestContactConfig;
  stay: SummaryItem[];
  wifi: { networkName: string; password: string; qrImage?: string; };
  arrival: InstructionStep[];
  hotTub: { title: string; description: string; image?: string; instructions: GuideItem[]; };
  apartmentGuide: GuideItem[];
  facilities: { title: string; body: string; items: SummaryItem[]; };
  localCategories: string[];
  localRecommendations: LocalRecommendation[];
  transport: GuideItem[];
  houseRules: GuideItem[];
  checkout: string[];
}
