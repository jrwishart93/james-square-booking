export const DIRECTORY_CATEGORIES = [
  { id: 'food', label: 'Food & drink' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'groceries', label: 'Groceries' },
  { id: 'pharmacy', label: 'Pharmacies' },
  { id: 'gp', label: 'GP practices' },
] as const;

export type DirectoryCategory = (typeof DIRECTORY_CATEGORIES)[number]['id'];

export type DirectoryPlace = {
  name: string;
  category: DirectoryCategory;
  desc: string;
  address?: string;
  phone?: string;
  site?: string;
  map: string;
};

/** A Google Maps search link, for places we hold no verified pin for. */
function mapSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query}, Edinburgh`)}`;
}

export const DIRECTORY: DirectoryPlace[] = [
  // Food & drink
  {
    name: 'Hot World Cuisine Buffet',
    category: 'food',
    desc: 'Large international all-you-can-eat buffet at the end of Dalry Road. Prices vary by day.',
    address: 'Dalry Road',
    map: mapSearch('Hot World Cuisine Buffet Dalry Road'),
  },
  {
    name: 'First Coast',
    category: 'food',
    desc: 'Modern Scottish bistro with fresh, seasonal menus.',
    address: '97–101 Dalry Road, EH11 2AB',
    phone: '+441313134404',
    site: 'https://first-coast.co.uk',
    map: 'https://maps.app.goo.gl/AmhsMkzahv44ko1e8?g_st=ipc',
  },
  {
    name: 'La Casa',
    category: 'food',
    desc: 'Tapas and mezze with Mediterranean flavours.',
    address: '103–105 Dalry Road, EH11 2AB',
    phone: '01313372875',
    site: 'https://la-casa-restaurant.co.uk',
    map: 'https://maps.app.goo.gl/bubDdGhPAbQaJPkD8?g_st=ipc',
  },
  {
    name: 'Locanda De Gusti',
    category: 'food',
    desc: 'Neapolitan Italian cooking in a homely setting.',
    address: '102 Dalry Road, EH11 2DW',
    phone: '+441313468800',
    site: 'https://locandadegusti.com',
    map: 'https://maps.app.goo.gl/N1WB5xvQWjd4nvSq6?g_st=ipc',
  },
  {
    name: 'Kuzina',
    category: 'food',
    desc: 'Greek eatery, from souvlaki and moussaka to salads and mezze.',
    address: '84 Dalry Road, EH11 2AX',
    phone: '01312256066',
    site: 'https://kuzinaedinburgh.co.uk',
    map: 'https://maps.app.goo.gl/ZnUcb9Acp74yWd1T7?g_st=ipc',
  },
  {
    name: 'Mia Italian Kitchen',
    category: 'food',
    desc: 'Pizzas, pastas and traditional Italian dishes.',
    address: '96 Dalry Road, EH11 2AX',
    phone: '01316291750',
    site: 'https://mia-restaurant.co.uk',
    map: 'https://maps.app.goo.gl/gT6npc6BMHzTq8739?g_st=ipc',
  },
  {
    name: 'The Fountain',
    category: 'food',
    desc: 'Pub classics such as fish and chips, pies and burgers.',
    address: '131 Dundee Street, EH11 1AX',
    site: 'https://fountainbar.co.uk',
    map: 'https://maps.app.goo.gl/sTSyoFAYQptRSyaW8?g_st=ipc',
  },
  {
    name: 'Kebabish',
    category: 'food',
    desc: 'Pakistani and Indian food: chargrilled kebabs, curries and fresh naan.',
    address: '128 Dalry Road, EH11 2EZ',
    phone: '01313373371',
    site: 'https://ko-edinburgh.co.uk',
    map: 'https://maps.app.goo.gl/sXkyaW5stYCtbATw8?g_st=ipc',
  },
  {
    name: 'Sushiya',
    category: 'food',
    desc: 'Small Japanese restaurant specialising in sushi and sashimi.',
    address: '93 Dalry Road, EH11 2AB',
    phone: '+447340888780',
    site: 'https://sushiya-jp.com',
    map: 'https://maps.app.goo.gl/1owzMordTrvdpUvEA?g_st=ipc',
  },

  // Coffee
  {
    name: 'Roasters',
    category: 'coffee',
    desc: 'Locally roasted coffee in a relaxed setting.',
    address: '58 Dalry Road, EH11 2AY',
    phone: '01312593073',
    site: 'https://the-roasters.co.uk',
    map: 'https://maps.app.goo.gl/dbRhj9TqNGVq4tJSA?g_st=ipc',
  },
  {
    name: 'Throat Punch',
    category: 'coffee',
    desc: 'Community-focused café known for its flat whites.',
    address: '30 Dalry Road, EH11 2BA',
    phone: '07984983066',
    site: 'https://throatpunch.co.uk',
    map: 'https://maps.app.goo.gl/uedsBb2w7xQFvUZ88?g_st=ipc',
  },
  {
    name: 'Not Just Coffee',
    category: 'coffee',
    desc: 'Artisan coffee with homemade cakes.',
    address: '165–167 Dalry Road, EH11 2EA',
    phone: '07766904442',
    map: 'https://maps.app.goo.gl/EvGBTx5XApScaCta8?g_st=ipc',
  },
  {
    name: 'Chapter One',
    category: 'coffee',
    desc: 'Vegan micro-roastery.',
    address: '107–109 Dalry Road, EH11 2DR',
    phone: '+447900075632',
    site: 'https://chapterone.coffee',
    map: 'https://maps.app.goo.gl/2JR9yCGdRuj57yPC6?g_st=ipc',
  },
  {
    name: 'Black Sheep Coffee',
    category: 'coffee',
    desc: 'Coffee, smoothies and pastries at Haymarket. Dog friendly.',
    address: '8 Haymarket Square, EH3 8RY',
    phone: '+442039886994',
    site: 'https://blacksheepcoffee.co.uk',
    map: 'https://maps.app.goo.gl/nozosckyPm6eULsR7?g_st=ipc',
  },

  // Groceries
  {
    name: 'Co-op Food',
    category: 'groceries',
    desc: 'Closest convenience store, open late. Voi bikes are usually parked outside.',
    address: '114 Dalry Road, EH11 2EZ',
    map: 'https://maps.app.goo.gl/rBzUKwdusLq3GLDw5?g_st=ipc',
  },
  {
    name: 'Lidl',
    category: 'groceries',
    desc: 'Discount supermarket with an in-store bakery.',
    address: 'Dalry Road, EH11 2EF',
    map: 'https://maps.app.goo.gl/Hh46iSbbhCAVHGu4A?g_st=ipc',
  },
  {
    name: 'Tesco Express',
    category: 'groceries',
    desc: 'Top-up shop at Haymarket.',
    address: '78–82 Haymarket Terrace, EH12',
    map: 'https://maps.app.goo.gl/kreRFxGswvmMdd9F9?g_st=ipc',
  },
  {
    name: 'Sainsbury’s Local',
    category: 'groceries',
    desc: 'Convenience branch on Dundee Street.',
    address: '81–85 Dundee Street, EH11 1AW',
    map: 'https://maps.app.goo.gl/B4cYp64Vji41puFi8?g_st=ipc',
  },
  {
    name: 'Scotmid',
    category: 'groceries',
    desc: 'Scottish co-operative convenience store.',
    address: '112 Dundee Street',
    map: 'https://maps.app.goo.gl/hzU9Ywv8fah8DUxJ9?g_st=ipc',
  },

  // Pharmacies
  {
    name: 'Apple Pharmacy',
    category: 'pharmacy',
    desc: 'Pharmacy on Dalry Road.',
    address: 'Dalry Road',
    map: mapSearch('Apple Pharmacy Dalry Road'),
  },
  {
    name: 'M&D Pharmacy',
    category: 'pharmacy',
    desc: 'Pharmacy on Dundee Street.',
    address: 'Dundee Street',
    map: mapSearch('M&D Pharmacy Dundee Street'),
  },
  {
    name: 'Boots',
    category: 'pharmacy',
    desc: 'Pharmacy at Haymarket.',
    address: 'Haymarket',
    map: mapSearch('Boots Haymarket'),
  },
  {
    name: 'Omnicare Pharmacy',
    category: 'pharmacy',
    desc: 'Pharmacy at Springwell, Ardmillan Terrace.',
    address: 'Ardmillan Terrace',
    map: mapSearch('Omnicare Pharmacy Springwell Ardmillan Terrace'),
  },

  // GP practices
  {
    name: 'Springwell Medical Centre',
    category: 'gp',
    desc: 'GP practice nearby. Check whether it is taking new patients.',
    address: 'Ardmillan Terrace',
    map: mapSearch('Springwell Medical Centre Ardmillan Terrace'),
  },
  {
    name: 'Gilmore Medical Practice',
    category: 'gp',
    desc: 'GP practice nearby. Check whether it is taking new patients.',
    map: mapSearch('Gilmore Medical Practice'),
  },
  {
    name: 'Leven Medical Practice',
    category: 'gp',
    desc: 'GP practice nearby. Check whether it is taking new patients.',
    map: mapSearch('Leven Medical Practice'),
  },
];
