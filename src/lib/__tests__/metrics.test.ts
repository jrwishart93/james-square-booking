import { describe, it, expect } from 'vitest'
import { monthKey } from '../../../functions/src/metrics'

describe('metrics', () => {
  describe('monthKey', () => {
    it('should format current date to YYYYMM', () => {
      const date = new Date('2026-01-24T12:00:00Z')
      expect(monthKey(date)).toBe('202601')
    })

    it('should handle January correctly', () => {
      const date = new Date('2026-01-15T00:00:00Z')
      expect(monthKey(date)).toBe('202601')
    })

    it('should handle December correctly', () => {
      const date = new Date('2025-12-31T23:59:59Z')
      expect(monthKey(date)).toBe('202512')
    })

    it('should pad single-digit months with zero', () => {
      expect(monthKey(new Date('2026-01-01T00:00:00Z'))).toBe('202601')
      expect(monthKey(new Date('2026-02-01T00:00:00Z'))).toBe('202602')
      expect(monthKey(new Date('2026-09-01T00:00:00Z'))).toBe('202609')
    })

    it('should not pad double-digit months', () => {
      expect(monthKey(new Date('2026-10-01T00:00:00Z'))).toBe('202610')
      expect(monthKey(new Date('2026-11-01T00:00:00Z'))).toBe('202611')
      expect(monthKey(new Date('2026-12-01T00:00:00Z'))).toBe('202612')
    })

    it('should handle year boundaries correctly', () => {
      // Last day of year
      expect(monthKey(new Date('2025-12-31T23:59:59Z'))).toBe('202512')
      // First day of year
      expect(monthKey(new Date('2026-01-01T00:00:00Z'))).toBe('202601')
    })

    it('should handle month boundaries correctly', () => {
      // Last day of January
      expect(monthKey(new Date('2026-01-31T23:59:59Z'))).toBe('202601')
      // First day of February
      expect(monthKey(new Date('2026-02-01T00:00:00Z'))).toBe('202602')
    })

    it('should handle Date object', () => {
      const date = new Date('2026-06-15T10:30:00Z')
      expect(monthKey(date)).toBe('202606')
    })

    it('should handle timestamp number', () => {
      const timestamp = new Date('2026-03-20T08:00:00Z').getTime()
      expect(monthKey(timestamp)).toBe('202603')
    })

    it('should handle ISO string', () => {
      const isoString = '2026-07-04T00:00:00Z'
      expect(monthKey(isoString)).toBe('202607')
    })

    it('should handle undefined (defaults to current date)', () => {
      const result = monthKey(undefined)
      // Should be a valid YYYYMM format
      expect(result).toMatch(/^\d{6}$/)
      // Should be at least 202601 (January 2026)
      expect(parseInt(result)).toBeGreaterThanOrEqual(202601)
    })

    it('should use UTC month, not local time', () => {
      // This ensures consistent behavior across timezones
      const date = new Date('2026-01-01T00:00:00Z')
      expect(monthKey(date)).toBe('202601')
    })

    it('should handle leap year February', () => {
      const date = new Date('2024-02-29T12:00:00Z') // 2024 is a leap year
      expect(monthKey(date)).toBe('202402')
    })

    it('should handle far future dates', () => {
      const date = new Date('2050-12-31T00:00:00Z')
      expect(monthKey(date)).toBe('205012')
    })

    it('should handle far past dates', () => {
      const date = new Date('2020-01-01T00:00:00Z')
      expect(monthKey(date)).toBe('202001')
    })
  })
})
