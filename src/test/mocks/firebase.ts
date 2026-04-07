import { vi } from 'vitest'

/**
 * Mock Firebase Admin Auth
 * Used for authentication and session verification in API routes
 */
export const mockAdminAuth = {
  verifySessionCookie: vi.fn(),
  getUserByEmail: vi.fn(),
  setCustomUserClaims: vi.fn(),
  getUser: vi.fn(),
  listUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}

/**
 * Mock Firestore Document Reference
 */
export const createMockDocRef = (data: any = {}, options: { exists?: boolean } = {}) => ({
  id: data.id || 'mock-doc-id',
  get: vi.fn().mockResolvedValue({
    exists: options.exists ?? true,
    id: data.id || 'mock-doc-id',
    data: () => data,
  }),
  set: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  collection: vi.fn(),
})

/**
 * Mock Firestore Query
 */
export const createMockQuery = (docs: any[] = []) => ({
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  startAfter: vi.fn().mockReturnThis(),
  get: vi.fn().mockResolvedValue({
    docs: docs.map((data) => ({
      id: data.id || 'mock-doc-id',
      data: () => data,
      exists: true,
    })),
    empty: docs.length === 0,
    size: docs.length,
  }),
})

/**
 * Mock Firestore Collection Reference
 */
export const createMockCollectionRef = (docs: any[] = []) => {
  const query = createMockQuery(docs)
  return {
    doc: vi.fn((id?: string) => createMockDocRef({ id })),
    add: vi.fn().mockResolvedValue(createMockDocRef()),
    ...query,
  }
}

/**
 * Mock Firestore Database
 */
export const mockFirestore = {
  collection: vi.fn((name: string) => createMockCollectionRef()),
  doc: vi.fn((path: string) => createMockDocRef()),
  batch: vi.fn(() => ({
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  })),
  runTransaction: vi.fn(),
}

/**
 * Mock Firebase Admin App
 */
export const mockAdminApp = {
  name: 'mock-admin-app',
  options: {},
  auth: () => mockAdminAuth,
  firestore: () => mockFirestore,
}

/**
 * Mock Firebase Admin module
 * This is what gets imported as 'firebase-admin'
 */
export const mockFirebaseAdmin = {
  apps: [] as any[],
  app: vi.fn(() => mockAdminApp),
  initializeApp: vi.fn(() => mockAdminApp),
  auth: vi.fn(() => mockAdminAuth),
  firestore: vi.fn(() => mockFirestore),
  credential: {
    cert: vi.fn((serviceAccount: any) => ({ serviceAccount })),
    applicationDefault: vi.fn(),
  },
}

/**
 * Reset all Firebase mocks
 * Call this in beforeEach/afterEach to ensure clean state
 */
export function resetFirebaseMocks() {
  vi.clearAllMocks()
  mockFirebaseAdmin.apps = []
}

/**
 * Helper to set up Firebase Admin mock for tests
 * Usage:
 *   vi.mock('firebase-admin', () => mockFirebaseAdmin)
 */
export function setupFirebaseAdminMock() {
  return mockFirebaseAdmin
}
