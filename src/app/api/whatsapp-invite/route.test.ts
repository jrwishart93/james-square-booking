import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getPrivateHub: vi.fn() }));

vi.mock('server-only', () => ({}));
vi.mock('@/lib/committeeMeetings.server', () => ({
  DEFAULT_WHATSAPP_URL: 'https://chat.whatsapp.com/DefaultCommunity',
  getPrivateHub: mocks.getPrivateHub,
  withTimeout: <T,>(promise: Promise<T>) => promise,
}));
vi.mock('@/lib/security/rateLimit', () => ({
  clientKey: () => 'test-client',
  rateLimit: () => ({ allowed: true }),
  tooManyRequests: vi.fn(),
}));

import { POST } from './route';

const correct = { policeBox: 'coffee', station: 'haymarket', paving: 'james-square' };
const post = (body: unknown) =>
  POST(new Request('http://localhost/api/whatsapp-invite', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }));

describe('POST /api/whatsapp-invite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPrivateHub.mockResolvedValue({ whatsappUrl: 'https://chat.whatsapp.com/AdminSetLink' });
  });
  afterEach(() => vi.unstubAllEnvs());

  it('returns the community invite set in the admin screen when every answer is right', async () => {
    const result = await post({ group: 'community', answers: correct });
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ url: 'https://chat.whatsapp.com/AdminSetLink' });
    expect(result.headers.get('Cache-Control')).toBe('no-store');
  });

  it('never returns a link, or says which answer was wrong, for any wrong answer', async () => {
    for (const wrong of [
      { ...correct, policeBox: 'phone-box' },
      { ...correct, station: 'waverley' },
      { ...correct, paving: 'welcome' },
    ]) {
      const result = await post({ group: 'community', answers: wrong });
      expect(result.status).toBe(403);
      const text = await result.text();
      expect(text).not.toContain('chat.whatsapp.com');
      expect(text).not.toMatch(/police|station|paving/i);
    }
  });

  it('rejects missing answers, extra answers and unknown groups', async () => {
    const { paving: _omit, ...partial } = correct;
    void _omit;
    expect((await post({ group: 'community', answers: partial })).status).toBe(403);
    expect((await post({ group: 'community', answers: { ...correct, extra: 'x' } })).status).toBe(403);
    expect((await post({ group: 'committee', answers: correct })).status).toBe(400);
    expect((await post({ group: 'community' })).status).toBe(403);
  });

  it('falls back to the default community invite when the admin setting is unavailable or not WhatsApp', async () => {
    mocks.getPrivateHub.mockRejectedValue(new Error('down'));
    expect(await (await post({ group: 'community', answers: correct })).json()).toEqual({
      url: 'https://chat.whatsapp.com/DefaultCommunity',
    });
    mocks.getPrivateHub.mockResolvedValue({ whatsappUrl: 'https://evil.example/invite' });
    expect(await (await post({ group: 'community', answers: correct })).json()).toEqual({
      url: 'https://chat.whatsapp.com/DefaultCommunity',
    });
  });

  it('uses RESIDENTS_WHATSAPP_URL for the residents group when it is set', async () => {
    vi.stubEnv('RESIDENTS_WHATSAPP_URL', 'https://chat.whatsapp.com/NewResidentsLink');
    expect(await (await post({ group: 'residents', answers: correct })).json()).toEqual({
      url: 'https://chat.whatsapp.com/NewResidentsLink',
    });
  });
});
