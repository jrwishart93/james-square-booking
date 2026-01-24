import { describe, it, expect } from 'vitest'
import {
  addDuration,
  formatTimeRemaining,
  getVoteStatus,
  DURATION_PRESETS,
  type DurationPreset,
} from '../voteExpiry'

describe('voteExpiry', () => {
  describe('DURATION_PRESETS', () => {
    it('should have 6 duration presets', () => {
      expect(DURATION_PRESETS).toHaveLength(6)
    })

    it('should have correct values and labels', () => {
      expect(DURATION_PRESETS[0]).toEqual({
        value: '3m',
        label: '3 minutes',
        seconds: 180,
      })
      expect(DURATION_PRESETS[1]).toEqual({
        value: '1h',
        label: '1 hour',
        seconds: 3600,
      })
      expect(DURATION_PRESETS[2]).toEqual({
        value: '1d',
        label: '1 day',
        seconds: 86400,
      })
      expect(DURATION_PRESETS[3]).toEqual({
        value: '1w',
        label: '1 week',
        seconds: 604800,
      })
      expect(DURATION_PRESETS[4]).toEqual({
        value: '1m',
        label: '1 month',
        seconds: 2592000,
      })
      expect(DURATION_PRESETS[5]).toEqual({
        value: '1y',
        label: '1 year',
        seconds: 31536000,
      })
    })
  })

  describe('addDuration', () => {
    const baseDate = new Date('2026-01-24T12:00:00Z')

    it('should add 3 minutes correctly', () => {
      const result = addDuration(baseDate, '3m')
      expect(result.getTime() - baseDate.getTime()).toBe(180000) // 3 * 60 * 1000
    })

    it('should add 1 hour correctly', () => {
      const result = addDuration(baseDate, '1h')
      expect(result.getTime() - baseDate.getTime()).toBe(3600000) // 60 * 60 * 1000
    })

    it('should add 1 day correctly', () => {
      const result = addDuration(baseDate, '1d')
      expect(result.getTime() - baseDate.getTime()).toBe(86400000) // 24 * 60 * 60 * 1000
    })

    it('should add 1 week correctly', () => {
      const result = addDuration(baseDate, '1w')
      expect(result.getTime() - baseDate.getTime()).toBe(604800000) // 7 * 24 * 60 * 60 * 1000
    })

    it('should add 1 month correctly (30 days)', () => {
      const result = addDuration(baseDate, '1m')
      expect(result.getTime() - baseDate.getTime()).toBe(2592000000) // 30 * 24 * 60 * 60 * 1000
    })

    it('should add 1 year correctly (365 days)', () => {
      const result = addDuration(baseDate, '1y')
      expect(result.getTime() - baseDate.getTime()).toBe(31536000000) // 365 * 24 * 60 * 60 * 1000
    })

    it('should default to 1 month for invalid preset', () => {
      const result = addDuration(baseDate, 'invalid' as DurationPreset)
      expect(result.getTime() - baseDate.getTime()).toBe(2592000000) // defaults to 1m
    })
  })

  describe('formatTimeRemaining', () => {
    it('should return "Closed" for 0ms', () => {
      expect(formatTimeRemaining(0)).toBe('Closed')
    })

    it('should return "Closed" for negative values', () => {
      expect(formatTimeRemaining(-1000)).toBe('Closed')
      expect(formatTimeRemaining(-60000)).toBe('Closed')
    })

    it('should return "Closes soon" for less than 1 minute', () => {
      expect(formatTimeRemaining(1)).toBe('Closes soon')
      expect(formatTimeRemaining(30000)).toBe('Closes soon') // 30 seconds
      expect(formatTimeRemaining(59999)).toBe('Closes soon') // Just under 1 min
    })

    it('should return "Closes in 1 minute" for exactly 1 minute', () => {
      expect(formatTimeRemaining(60000)).toBe('Closes in 1 minute')
    })

    it('should return "Closes in X minutes" for multiple minutes', () => {
      expect(formatTimeRemaining(120000)).toBe('Closes in 2 minutes') // 2 min
      expect(formatTimeRemaining(180000)).toBe('Closes in 3 minutes') // 3 min
      expect(formatTimeRemaining(3540000)).toBe('Closes in 59 minutes') // 59 min
    })

    it('should return "Closes in 1 hour" for exactly 1 hour', () => {
      expect(formatTimeRemaining(3600000)).toBe('Closes in 1 hour')
    })

    it('should return "Closes in X hours" for multiple hours', () => {
      expect(formatTimeRemaining(7200000)).toBe('Closes in 2 hours') // 2 hours
      expect(formatTimeRemaining(10800000)).toBe('Closes in 3 hours') // 3 hours
      expect(formatTimeRemaining(82800000)).toBe('Closes in 23 hours') // 23 hours
    })

    it('should return "Closes in 1 day" for exactly 1 day', () => {
      expect(formatTimeRemaining(86400000)).toBe('Closes in 1 day')
    })

    it('should return "Closes in X days" for multiple days', () => {
      expect(formatTimeRemaining(172800000)).toBe('Closes in 2 days') // 2 days
      expect(formatTimeRemaining(259200000)).toBe('Closes in 3 days') // 3 days
      expect(formatTimeRemaining(604800000)).toBe('Closes in 7 days') // 7 days
      expect(formatTimeRemaining(2592000000)).toBe('Closes in 30 days') // 30 days
    })

    it('should handle edge cases around boundaries', () => {
      expect(formatTimeRemaining(59999)).toBe('Closes soon') // 59.999 seconds
      expect(formatTimeRemaining(60000)).toBe('Closes in 1 minute') // 60 seconds
      expect(formatTimeRemaining(60001)).toBe('Closes in 1 minute') // 60.001 seconds

      expect(formatTimeRemaining(3599999)).toBe('Closes in 59 minutes') // 59.999 minutes
      expect(formatTimeRemaining(3600000)).toBe('Closes in 1 hour') // 60 minutes
      expect(formatTimeRemaining(3600001)).toBe('Closes in 1 hour') // 60.001 minutes

      expect(formatTimeRemaining(86399999)).toBe('Closes in 23 hours') // 23.999 hours
      expect(formatTimeRemaining(86400000)).toBe('Closes in 1 day') // 24 hours
      expect(formatTimeRemaining(86400001)).toBe('Closes in 1 day') // 24.001 hours
    })
  })

  describe('getVoteStatus', () => {
    const now = new Date('2026-01-24T12:00:00Z')

    describe('scheduled votes', () => {
      it('should return scheduled status when startsAt is in the future', () => {
        const startsAt = new Date('2026-01-25T12:00:00Z')
        const expiresAt = new Date('2026-01-26T12:00:00Z')

        const result = getVoteStatus(now, expiresAt, startsAt)

        expect(result).toEqual({
          isExpired: false,
          isOpen: false,
          isScheduled: true,
          phase: 'scheduled',
          label: 'Scheduled',
          kind: 'scheduled',
        })
      })

      it('should return scheduled status even without expiresAt', () => {
        const startsAt = new Date('2026-01-25T12:00:00Z')

        const result = getVoteStatus(now, null, startsAt)

        expect(result).toEqual({
          isExpired: false,
          isOpen: false,
          isScheduled: true,
          phase: 'scheduled',
          label: 'Scheduled',
          kind: 'scheduled',
        })
      })
    })

    describe('open votes without expiry', () => {
      it('should return open status when no expiresAt is provided', () => {
        const result = getVoteStatus(now)

        expect(result).toEqual({
          isExpired: false,
          isOpen: true,
          isScheduled: false,
          phase: 'open',
          label: 'Open',
          kind: 'open',
        })
      })

      it('should return open status when expiresAt is null', () => {
        const result = getVoteStatus(now, null)

        expect(result).toEqual({
          isExpired: false,
          isOpen: true,
          isScheduled: false,
          phase: 'open',
          label: 'Open',
          kind: 'open',
        })
      })

      it('should return open status when startsAt is in the past and no expiresAt', () => {
        const startsAt = new Date('2026-01-23T12:00:00Z')

        const result = getVoteStatus(now, null, startsAt)

        expect(result).toEqual({
          isExpired: false,
          isOpen: true,
          isScheduled: false,
          phase: 'open',
          label: 'Open',
          kind: 'open',
        })
      })
    })

    describe('closed votes', () => {
      it('should return closed status when expiresAt is in the past', () => {
        const expiresAt = new Date('2026-01-23T12:00:00Z')

        const result = getVoteStatus(now, expiresAt)

        expect(result).toEqual({
          isExpired: true,
          isOpen: false,
          isScheduled: false,
          phase: 'closed',
          label: 'Closed',
          kind: 'closed',
        })
      })

      it('should return closed status when expiresAt equals now', () => {
        const expiresAt = new Date('2026-01-24T12:00:00Z')

        const result = getVoteStatus(now, expiresAt)

        expect(result).toEqual({
          isExpired: true,
          isOpen: false,
          isScheduled: false,
          phase: 'closed',
          label: 'Closed',
          kind: 'closed',
        })
      })
    })

    describe('open votes with time remaining', () => {
      it('should return open status with "Closes soon" for < 1 minute remaining', () => {
        const expiresAt = new Date(now.getTime() + 30000) // 30 seconds

        const result = getVoteStatus(now, expiresAt)

        expect(result.isExpired).toBe(false)
        expect(result.isOpen).toBe(true)
        expect(result.isScheduled).toBe(false)
        expect(result.phase).toBe('open')
        expect(result.label).toBe('Closes soon')
        expect(result.kind).toBe('open')
      })

      it('should return open status with "Closes in 1 minute"', () => {
        const expiresAt = new Date(now.getTime() + 60000) // 1 minute

        const result = getVoteStatus(now, expiresAt)

        expect(result.isOpen).toBe(true)
        expect(result.label).toBe('Closes in 1 minute')
      })

      it('should return open status with "Closes in X hours"', () => {
        const expiresAt = new Date(now.getTime() + 7200000) // 2 hours

        const result = getVoteStatus(now, expiresAt)

        expect(result.isOpen).toBe(true)
        expect(result.label).toBe('Closes in 2 hours')
      })

      it('should return open status with "Closes in X days"', () => {
        const expiresAt = new Date(now.getTime() + 259200000) // 3 days

        const result = getVoteStatus(now, expiresAt)

        expect(result.isOpen).toBe(true)
        expect(result.label).toBe('Closes in 3 days')
      })
    })

    describe('edge cases', () => {
      it('should prioritize scheduled status over expired when both conditions could apply', () => {
        const startsAt = new Date('2026-01-25T12:00:00Z') // future
        const expiresAt = new Date('2026-01-23T12:00:00Z') // past (shouldn't happen but test it)

        const result = getVoteStatus(now, expiresAt, startsAt)

        expect(result.phase).toBe('scheduled')
      })

      it('should handle startsAt equal to now', () => {
        const startsAt = new Date('2026-01-24T12:00:00Z')
        const expiresAt = new Date('2026-01-25T12:00:00Z')

        const result = getVoteStatus(now, expiresAt, startsAt)

        // At exact start time, should be open
        expect(result.isOpen).toBe(true)
        expect(result.isScheduled).toBe(false)
      })
    })
  })
})
