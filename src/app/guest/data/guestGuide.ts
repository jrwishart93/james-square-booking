import type { GuestGuideData } from '../types/guestGuide';

// Guest access/security details intentionally live in this single config file so
// PIN protection, booking-specific content, or Firestore-backed content can be added later.
export const guestGuide: GuestGuideData = {
  property: {
    name: 'James Square Guest Guide',
    heading: 'Welcome to James Square',
    address: '61/2 Caledonian Crescent, Edinburgh',
    locationLine: 'Edinburgh · Haymarket · Private garden and hot tub',
    intro: 'We are delighted to have you staying with us. Everything you need for your visit, from arrival information to local recommendations, can be found here.',
    heroImage: '/images/home-photos/09-building61.png',
    gardenImage: '/images/buildingimages/garden.jpg', // TODO: Replace with confirmed private garden/hot tub 4:3 image if available.
  },
  contacts: {
    hostPhone: '', // TODO: Replace with confirmed host phone number.
    whatsapp: '', // TODO: Replace with confirmed WhatsApp number.
    email: '', // TODO: Replace with confirmed host email.
    emergencyMaintenance: '', // TODO: Replace with emergency maintenance contact.
  },
  stay: [
    { label: 'Check-in', value: 'TODO: confirm time', icon: 'clock' },
    { label: 'Checkout', value: 'TODO: confirm time', icon: 'checkout' },
    { label: 'Guests', value: 'TODO: confirm maximum occupancy', icon: 'users' },
    { label: 'Address', value: '61/2 Caledonian Crescent, Edinburgh', icon: 'home' },
    { label: 'Parking', value: 'TODO: confirm availability and bay number', icon: 'car' },
    { label: 'Quiet hours', value: 'TODO: confirm quiet hours', icon: 'moon' },
    { label: 'Host support', value: 'TODO: add phone, WhatsApp and email', icon: 'phone' },
  ],
  wifi: {
    networkName: '', // TODO: Replace with confirmed guest Wi-Fi details.
    password: '', // TODO: Replace with confirmed guest Wi-Fi details.
  },
  arrival: [
    { title: 'Arriving at James Square', body: 'TODO: add confirmed route and arrival notes.', placeholder: true },
    { title: 'Entering the development', body: 'TODO: add gate instructions without publishing access codes here until confirmed.', placeholder: true },
    { title: 'Locating the apartment', body: 'TODO: add building entrance and apartment-finding guidance.', placeholder: true },
    { title: 'Collecting or accessing the key', body: 'TODO: add confirmed key collection or key-safe instructions.', placeholder: true },
    { title: 'Parking', body: 'TODO: add parking bay number, permit requirements and gate access details.', placeholder: true },
    { title: 'If there is a problem', body: 'TODO: add arrival contact details and fallback instructions.', placeholder: true },
  ],
  hotTub: {
    title: 'Private garden and hot tub',
    description: 'A calm outdoor space for relaxing during your stay. Confirmed operating instructions will be added before guest use.',
    image: '/images/buildingimages/garden.jpg',
    instructions: [
      { title: 'Cover and setup', icon: 'waves', summary: 'How to remove and replace the cover.', instructions: ['TODO: add confirmed cover handling instructions.'], placeholder: true },
      { title: 'Temperature controls', icon: 'thermometer', summary: 'Confirmed controls to be added.', instructions: ['TODO: add confirmed temperature-control guidance.'], placeholder: true },
      { title: 'Safety and care', icon: 'shield', summary: 'No glass near the hot tub; keep noise respectful.', instructions: ['TODO: confirm maximum occupancy, showering guidance, end-of-use care and fault reporting.'], placeholder: true },
    ],
  },
  apartmentGuide: [
    { title: 'Heating', icon: 'thermometer', summary: 'Heating instructions placeholder.', instructions: ['TODO: add confirmed heating instructions.'], placeholder: true },
    { title: 'Hot water', icon: 'waves', summary: 'Hot-water guidance placeholder.', instructions: ['TODO: add confirmed hot-water instructions.'], placeholder: true },
    { title: 'Television', icon: 'tv', summary: 'TV instructions placeholder.', instructions: ['TODO: add confirmed television instructions.'], placeholder: true },
    { title: 'Kitchen', icon: 'chef', summary: 'Kitchen basics placeholder.', instructions: ['TODO: add confirmed kitchen guidance.'], placeholder: true },
    { title: 'Oven and hob', icon: 'chef', summary: 'Appliance instructions placeholder.', instructions: ['TODO: add oven and hob instructions.'], placeholder: true },
    { title: 'Dishwasher', icon: 'sparkles', summary: 'Dishwasher guidance placeholder.', instructions: ['TODO: add dishwasher instructions.'], placeholder: true },
    { title: 'Washing machine', icon: 'sparkles', summary: 'Laundry guidance placeholder.', instructions: ['TODO: add washing-machine instructions.'], placeholder: true },
    { title: 'Coffee facilities', icon: 'coffee', summary: 'Coffee setup placeholder.', instructions: ['TODO: add coffee facilities details.'], placeholder: true },
    { title: 'Bins and recycling', icon: 'trash', summary: 'Waste guidance placeholder.', instructions: ['TODO: add bin location and recycling instructions.'], placeholder: true },
    { title: 'Workspace', icon: 'briefcase', summary: 'Workspace notes placeholder.', instructions: ['TODO: add workspace details if applicable.'], placeholder: true },
    { title: 'Garden access', icon: 'leaf', summary: 'Garden-door guidance placeholder.', instructions: ['TODO: add confirmed garden access and security guidance.'], placeholder: true },
  ],
  facilities: {
    title: 'Shared facility update',
    body: 'The communal swimming pool, sauna and gym are currently closed pending assessment and repair. The private garden and hot tub attached to the apartment are separate and remain available to guests unless advised otherwise.',
    items: [
      { label: 'Swimming pool', value: 'Temporarily closed', icon: 'waves' },
      { label: 'Sauna', value: 'Temporarily closed', icon: 'thermometer' },
      { label: 'Gym', value: 'Temporarily closed', icon: 'users' },
    ],
  },
  localCategories: ['Food and drink', 'Groceries', 'Transport', 'Attractions', 'Entertainment', 'Essentials', 'Walks', 'Rainy-day activities'],
  localRecommendations: [
    { name: 'Haymarket Station', category: 'Transport', description: 'Nearby rail, tram and bus hub. Verify platform and route details before travelling.', walkingTime: 'TODO', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Haymarket+Station+Edinburgh' },
    { name: 'Fountain Park', category: 'Entertainment', description: 'Leisure complex nearby; opening times and venues should be checked directly.', walkingTime: 'TODO', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fountain+Park+Edinburgh' },
    { name: 'Edinburgh Castle', category: 'Attractions', description: 'Historic landmark in the city centre. Bookings and opening times should be verified.', walkingTime: 'TODO', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Edinburgh+Castle' },
    { name: 'Nearby supermarket', category: 'Groceries', description: 'TODO: add preferred supermarket and practical notes.', walkingTime: 'TODO' },
    { name: 'Nearby pharmacy', category: 'Essentials', description: 'TODO: add preferred pharmacy once verified.', walkingTime: 'TODO' },
  ],
  transport: [
    { title: 'Haymarket Station', icon: 'train', summary: 'Rail, tram and bus connections nearby.', instructions: ['TODO: add preferred walking route.'], placeholder: true },
    { title: 'Airport tram', icon: 'train', summary: 'Use official travel information for times and tickets.', instructions: ['TODO: add nearest tram stop guidance.'], placeholder: true },
    { title: 'Taxis and drop-off', icon: 'car', summary: 'Taxi guidance placeholder.', instructions: ['TODO: add taxi drop-off guidance.'], placeholder: true },
    { title: 'Secure parking', icon: 'car', summary: 'Parking details placeholder.', instructions: ['TODO: add exact parking bay, permit requirements and gate access.'], placeholder: true },
  ],
  houseRules: [
    { title: 'A few things to help everyone enjoy their stay', icon: 'heart', summary: 'Friendly confirmed house rules will be added here.', instructions: ['No parties.', 'Booked guests only.', 'Please respect neighbours and quiet hours.', 'TODO: confirm smoking, pets, hot-tub use, fire safety and security rules.'], placeholder: true },
  ],
  checkout: ['TODO: confirm checkout time', 'Return keys as directed', 'Close windows', 'Switch off lights', 'Check heating', 'Dispose of rubbish as directed', 'Secure the garden door', 'Replace hot-tub cover', 'Report any damage or issues', 'Send a message when leaving'],
};
