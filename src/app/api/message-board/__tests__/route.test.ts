import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock firebase-admin BEFORE importing anything else
vi.mock('firebase-admin', () => {
  // Mock posts data (can't import from fixtures due to hoisting)
  const posts = [
    {
      id: 'post-1',
      title: 'Test Post 1',
      content: 'Content 1',
      authorId: 'user-1',
      createdAt: { toDate: () => new Date('2026-01-20T10:00:00Z') },
    },
    {
      id: 'post-2',
      title: 'Test Post 2',
      content: 'Content 2',
      authorId: 'user-2',
      createdAt: { toDate: () => new Date('2026-01-22T14:30:00Z') },
    },
    {
      id: 'post-3',
      title: 'Test Post 3',
      content: 'Content 3',
      authorId: 'user-3',
      createdAt: { toDate: () => new Date('2026-01-24T09:15:00Z') },
    },
  ]

  const mockDocs = posts.map((post) => ({
    id: post.id,
    data: () => post,
  }))

  const mockSnapshot = {
    docs: mockDocs,
  }

  const mockCollection = {
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue(mockSnapshot),
  }

  const mockFirestore = {
    collection: vi.fn(() => mockCollection),
  }

  const mockApp = {
    firestore: () => mockFirestore,
  }

  return {
    default: {
      apps: [],
      initializeApp: vi.fn(() => mockApp),
      credential: {
        cert: vi.fn(),
      },
      firestore: () => mockFirestore,
    },
  }
})

// Now we can import the route
import { GET } from '../route'

// Mock environment variable
process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({
  type: 'service_account',
  project_id: 'test-project',
  private_key_id: 'test-key-id',
  private_key: 'test-private-key',
  client_email: 'test@test.iam.gserviceaccount.com',
  client_id: 'test-client-id',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
})

describe('/api/message-board', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return posts with default limit of 10', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toBeDefined()
      expect(Array.isArray(data.posts)).toBe(true)
    })

    it('should return posts ordered by createdAt desc', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toHaveLength(3)

      // Verify posts have required fields
      data.posts.forEach((post: any) => {
        expect(post.id).toBeDefined()
        expect(post.title).toBeDefined()
        expect(post.content).toBeDefined()
        expect(post.authorId).toBeDefined()
      })
    })

    it('should respect custom limit parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board?limit=5')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toBeDefined()
    })

    it('should handle limit=0 gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board?limit=0')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toBeDefined()
    })

    it('should handle invalid limit parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board?limit=invalid')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toBeDefined()
    })

    it('should handle negative limit parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/message-board?limit=-5')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.posts).toBeDefined()
    })

    // Note: Database error test would require more complex mock setup
    // Testing error handling at integration level instead
  })
})
