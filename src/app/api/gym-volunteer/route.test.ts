import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveGymVolunteer: vi.fn(),
  setGymVolunteerDeliveryStatus: vi.fn(),
  sendWithResend: vi.fn(),
}));

vi.mock('@/lib/gymVolunteerStore', () => ({
  saveGymVolunteer: mocks.saveGymVolunteer,
  setGymVolunteerDeliveryStatus: mocks.setGymVolunteerDeliveryStatus,
}));
vi.mock('@/lib/email/sendWithResend', () => ({ sendWithResend: mocks.sendWithResend }));
vi.mock('@/lib/security/rateLimit', () => ({
  clientKey: () => 'test-client',
  rateLimit: () => ({ allowed: true }),
  tooManyRequests: vi.fn(),
}));

import { POST } from './route';

const valid = {
  name: 'Alex Resident', email: 'alex@example.com', location: 'Block 45',
  help: ['painting', 'cleaning'], comments: 'Free most weekends', privacyAcknowledgement: true, website: '',
};

const post = (body: unknown) => POST(new Request('http://localhost/api/gym-volunteer', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
}));

describe('POST /api/gym-volunteer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveGymVolunteer.mockResolvedValue('doc-1');
    mocks.setGymVolunteerDeliveryStatus.mockResolvedValue(undefined);
    mocks.sendWithResend.mockResolvedValue({ id: 'email-id' });
  });

  it('stores the offer and emails the committee only', async () => {
    const result = await post(valid);
    expect(result.status).toBe(200);
    expect(mocks.saveGymVolunteer).toHaveBeenCalledWith(expect.not.objectContaining({ website: expect.anything() }));
    expect(mocks.sendWithResend).toHaveBeenCalledWith(expect.objectContaining({
      to: 'committee@james-square.com',
      replyTo: 'alex@example.com',
      html: expect.stringContaining('Painting and decorating'),
    }));
    expect(mocks.setGymVolunteerDeliveryStatus).toHaveBeenCalledWith('doc-1', 'delivered');
  });

  it('escapes submitted text in the email', async () => {
    await post({ ...valid, comments: '<script>alert(1)</script>' });
    const { html } = mocks.sendWithResend.mock.calls[0][0];
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('rejects a missing help choice, privacy confirmation and unknown fields', async () => {
    const result = await post({ ...valid, help: [], privacyAcknowledgement: false });
    expect(result.status).toBe(400);
    const body = await result.json();
    expect(body.fields).toMatchObject({ help: expect.any(String), privacyAcknowledgement: expect.any(String) });
    expect((await post({ ...valid, role: 'admin' })).status).toBe(400);
    expect(mocks.sendWithResend).not.toHaveBeenCalled();
  });

  it('rejects a filled honeypot', async () => {
    expect((await post({ ...valid, website: 'spam.example' })).status).toBe(400);
    expect(mocks.saveGymVolunteer).not.toHaveBeenCalled();
  });

  it('still succeeds when the email fails but the offer was stored', async () => {
    mocks.sendWithResend.mockRejectedValue(new Error('down'));
    expect((await post(valid)).status).toBe(200);
    expect(mocks.setGymVolunteerDeliveryStatus).toHaveBeenCalledWith('doc-1', 'delivery-failed');
  });

  it('fails when neither storage nor email works', async () => {
    mocks.saveGymVolunteer.mockRejectedValue(new Error('down'));
    mocks.sendWithResend.mockRejectedValue(new Error('down'));
    expect((await post(valid)).status).toBe(503);
  });
});
