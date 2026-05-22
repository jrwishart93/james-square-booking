import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock firebase-admin/app
vi.mock('firebase-admin/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
  cert: vi.fn(),
  applicationDefault: vi.fn(),
}))

// Mock firebase-admin/firestore
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}))

// Mock firebase-admin/auth - define mockAuth inside factory
vi.mock('firebase-admin/auth', () => {
  const mockAuth = {
    verifySessionCookie: vi.fn(),
    getUserByEmail: vi.fn(),
  }
  return {
    getAuth: vi.fn(() => mockAuth),
    mockAuth, // Export for access in tests
  }
})

// Mock next/headers
vi.mock('next/headers', () => {
  const mockCookies = {
    get: vi.fn(),
  }
  return {
    cookies: vi.fn(() => mockCookies),
    mockCookies, // Export for access in tests
  }
})

// Import mocked modules to get access to the mocks
import { mockAuth } from 'firebase-admin/auth'
import { mockCookies } from 'next/headers'

// Now import the route
import { POST } from '../route'
import { mockUsers, mockSessionCookies } from '@/test/fixtures/users'

describe('/api/admin/find-user-by-email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set environment variable for tests
    process.env.FIREBASE_ADMIN_CREDENTIALS = JSON.stringify({
      type: 'service_account',
      project_id: 'test-project',
      private_key: 'test-key',
      client_email: 'test@test.com',
    })
  })

  describe('POST', () => {
    describe('authentication', () => {
      it('should return 401 when no session cookie is present', async () => {
        mockCookies.get.mockReturnValue(undefined)

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@james-square.com' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(401)
        const data = await response.json()
        expect(data.error).toBe('Not authenticated.')
      })

      it('should return 401 when session cookie is invalid', async () => {
        mockCookies.get.mockReturnValue({ value: mockSessionCookies.invalid })
        mockAuth.verifySessionCookie.mockRejectedValue(new Error('Invalid session'))

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@james-square.com' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(401)
        const data = await response.json()
        expect(data.error).toBe('Session invalid or expired.')
      })

      it('should return 403 when user is not an admin', async () => {
        mockCookies.get.mockReturnValue({ value: mockSessionCookies.validUser })
        mockAuth.verifySessionCookie.mockResolvedValue({
          uid: mockUsers.regularUser.uid,
          admin: false,
        })

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@james-square.com' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(403)
        const data = await response.json()
        expect(data.error).toBe('Admins only.')
      })
    })

    describe('input validation', () => {
      beforeEach(() => {
        // Setup valid admin session for these tests
        mockCookies.get.mockReturnValue({ value: mockSessionCookies.validAdmin })
        mockAuth.verifySessionCookie.mockResolvedValue({
          uid: mockUsers.admin.uid,
          admin: true,
        })
      })

      it('should return 400 when body is not valid JSON', async () => {
        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: 'invalid json',
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Invalid JSON body.')
      })

      it('should return 400 when email is missing', async () => {
        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({}),
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Email is required.')
      })

      it('should return 400 when email is empty string', async () => {
        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: '' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Email is required.')
      })

      it('should return 400 when email is only whitespace', async () => {
        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: '   ' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Email is required.')
      })

      it('should return 400 when email is not a string', async () => {
        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 123 }),
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Email is required.')
      })
    })

    describe('successful lookups', () => {
      beforeEach(() => {
        mockCookies.get.mockReturnValue({ value: mockSessionCookies.validAdmin })
        mockAuth.verifySessionCookie.mockResolvedValue({
          uid: mockUsers.admin.uid,
          admin: true,
        })
      })

      it('should return user UID for valid email', async () => {
        mockAuth.getUserByEmail.mockResolvedValue({
          uid: mockUsers.regularUser.uid,
          email: mockUsers.regularUser.email,
        })

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: mockUsers.regularUser.email }),
        })

        const response = await POST(request)

        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data.uid).toBe(mockUsers.regularUser.uid)
      })

      it('should normalize email to lowercase', async () => {
        mockAuth.getUserByEmail.mockResolvedValue({
          uid: mockUsers.regularUser.uid,
          email: mockUsers.regularUser.email,
        })

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'USER@JAMES-SQUARE.COM' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(200)
        expect(mockAuth.getUserByEmail).toHaveBeenCalledWith('user@james-square.com')
      })

      it('should trim whitespace from email', async () => {
        mockAuth.getUserByEmail.mockResolvedValue({
          uid: mockUsers.regularUser.uid,
          email: mockUsers.regularUser.email,
        })

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: '  user@james-square.com  ' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(200)
        expect(mockAuth.getUserByEmail).toHaveBeenCalledWith('user@james-square.com')
      })
    })

    describe('user not found', () => {
      beforeEach(() => {
        mockCookies.get.mockReturnValue({ value: mockSessionCookies.validAdmin })
        mockAuth.verifySessionCookie.mockResolvedValue({
          uid: mockUsers.admin.uid,
          admin: true,
        })
      })

      it('should return 404 when user does not exist', async () => {
        mockAuth.getUserByEmail.mockRejectedValue(new Error('User not found'))

        const request = new NextRequest('http://localhost:3000/api/admin/find-user-by-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'nonexistent@james-square.com' }),
        })

        const response = await POST(request)

        expect(response.status).toBe(404)
        const data = await response.json()
        expect(data.error).toBe('User not found.')
      })
    })
  })
})
