/**
 * Questions a visitor answers before the site reveals a WhatsApp invitation.
 *
 * This is a deterrent, not authentication: it stops passers-by and casual
 * visitors from joining residents' groups. The correct answers live only in
 * residentCheck.server.ts and the invitations are only ever sent by the server,
 * so neither reaches the browser until the answers are right.
 */

export type WhatsAppGroup = 'community' | 'residents';

export const RESIDENT_QUESTIONS = [
  {
    id: 'policeBox',
    question: 'There is a small police box beside James Square. What is it used for?',
    options: [
      { value: 'tourist-bus', label: 'Tourist bus tickets' },
      { value: 'dr-who', label: 'Selling Doctor Who merchandise' },
      { value: 'phone-box', label: 'A phone box' },
      { value: 'coffee', label: 'A coffee takeaway' },
      { value: 'library', label: 'A community library' },
    ],
  },
  {
    id: 'station',
    question: 'Which station is closest to James Square?',
    options: [
      { value: 'haymarket', label: 'Haymarket' },
      { value: 'waverley', label: 'Waverley' },
      { value: 'central', label: 'Central Station' },
    ],
  },
  {
    id: 'paving',
    question: 'In front of the main gates, what does the monoblock paving spell out?',
    options: [
      { value: 'entrance', label: 'ENTRANCE' },
      { value: 'welcome', label: 'WELCOME' },
      { value: 'private', label: 'PRIVATE' },
      { value: 'james-square', label: 'JAMES SQUARE' },
    ],
  },
] as const;

export type ResidentQuestionId = (typeof RESIDENT_QUESTIONS)[number]['id'];
export type ResidentAnswers = Record<ResidentQuestionId, string>;
