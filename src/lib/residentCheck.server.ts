import 'server-only';

import { DEFAULT_WHATSAPP_URL, getPrivateHub, withTimeout } from '@/lib/committeeMeetings.server';
import { RESIDENT_QUESTIONS, type ResidentAnswers, type WhatsAppGroup } from '@/lib/residentCheck';

const CORRECT: ResidentAnswers = {
  policeBox: 'coffee',
  station: 'haymarket',
  paving: 'james-square',
};

/**
 * Fallback for the residents' group, used only when RESIDENTS_WHATSAPP_URL is
 * not set. It has been published in this public repository, so after resetting
 * the link in WhatsApp, set the new one in that environment variable rather
 * than here. (The community group's link is managed from the meetings admin screen.)
 */
const FALLBACK_RESIDENTS_WHATSAPP_URL = 'https://chat.whatsapp.com/EthIN0lFJn0KqTktf5URk8';

/** True only when every question has an answer and all of them are right. */
export function residentAnswersCorrect(input: unknown): boolean {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
  const answers = input as Record<string, unknown>;
  if (Object.keys(answers).length !== RESIDENT_QUESTIONS.length) return false;
  return RESIDENT_QUESTIONS.every(({ id }) => answers[id] === CORRECT[id]);
}

function validInvite(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'chat.whatsapp.com' ? parsed.href : null;
  } catch {
    return null;
  }
}

export async function whatsAppInviteFor(group: WhatsAppGroup): Promise<string> {
  if (group === 'residents') {
    return validInvite(process.env.RESIDENTS_WHATSAPP_URL) ?? FALLBACK_RESIDENTS_WHATSAPP_URL;
  }
  // The committee can change the community invitation from the meetings admin screen.
  const hub = await withTimeout(getPrivateHub(), 3000).catch(() => null);
  return validInvite(hub?.whatsappUrl) ?? DEFAULT_WHATSAPP_URL;
}
