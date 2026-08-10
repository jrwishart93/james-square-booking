import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createCctvRequestRecord: vi.fn(),
  saveDeliveredCctvRequest: vi.fn(),
  setCctvRequestDeliveryStatus: vi.fn(),
  sendWithResend: vi.fn(),
}));

vi.mock('@/lib/cctvReference', () => ({
  createCctvRequestRecord: mocks.createCctvRequestRecord,
  saveDeliveredCctvRequest: mocks.saveDeliveredCctvRequest,
  setCctvRequestDeliveryStatus: mocks.setCctvRequestDeliveryStatus,
}));
vi.mock('@/lib/email/sendWithResend', () => ({ sendWithResend: mocks.sendWithResend }));
vi.mock('@/lib/security/rateLimit', () => ({
  clientKey: () => 'test-client',
  rateLimit: () => ({ allowed: true }),
  tooManyRequests: vi.fn(),
}));

import { POST } from './route';

const validRequest = {
  requestorName: 'Alex Resident', email: 'alex@example.com', telephone: '07000000000',
  property: 'Flat 1', preferredContact: 'email', incidentDate: '2026-08-10',
  timePrecision: 'exact', incidentTime: '14:30', timeFrom: '', timeTo: '',
  incidentType: 'other', location: 'Courtyard', detailedLocation: 'By the gate',
  policeStatus: 'not-applicable', policeReportDate: '', policeReference: '',
  officerDetails: '', narrative: 'A test incident', identifyingDetails: '',
  signature: 'Alex Resident', submissionDate: '2026-08-10',
  privacyAcknowledgement: true, policeAcknowledgement: true, website: '',
};

describe('POST /api/cctv/request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createCctvRequestRecord.mockRejectedValue(new Error('Firestore unavailable'));
    mocks.sendWithResend.mockResolvedValue({ id: 'email-id' });
    mocks.saveDeliveredCctvRequest.mockResolvedValue(undefined);
  });

  it('delivers to the fixed recipient when Firestore cannot create the record', async () => {
    const result = await POST(new Request('http://localhost/api/cctv/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' },
      body: JSON.stringify(validRequest),
    }));

    expect(result.status).toBe(200);
    const body = await result.json();
    expect(body).toEqual({ success: true, requestId: expect.stringMatching(/^JS-\d{8}-\d{4}$/) });
    expect(mocks.sendWithResend).toHaveBeenCalledWith(expect.objectContaining({
      from: 'James Square CCTV <cctv@james-square.com>',
      to: 'cctv@james-square.com',
      replyTo: 'alex@example.com',
      html: expect.stringContaining(body.requestId),
    }));
    expect(mocks.saveDeliveredCctvRequest).toHaveBeenCalledWith(body.requestId, expect.any(Object));
  });

  it('does not expose a bookkeeping failure after successful delivery', async () => {
    mocks.saveDeliveredCctvRequest.mockRejectedValue(new Error('Firestore unavailable'));

    const result = await POST(new Request('http://localhost/api/cctv/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.2' },
      body: JSON.stringify(validRequest),
    }));

    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({
      success: true,
      requestId: expect.stringMatching(/^JS-\d{8}-\d{4}$/),
    });
  });
});
