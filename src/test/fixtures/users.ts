/**
 * Test fixture data for users
 * Used across multiple test files for consistent test data
 */

export const mockUsers = {
  admin: {
    uid: 'admin-user-123',
    email: 'admin@james-square.com',
    displayName: 'Admin User',
    customClaims: {
      admin: true,
    },
  },
  owner: {
    uid: 'owner-user-456',
    email: 'owner@james-square.com',
    displayName: 'Owner User',
    customClaims: {
      owner: true,
    },
  },
  regularUser: {
    uid: 'regular-user-789',
    email: 'user@james-square.com',
    displayName: 'Regular User',
    customClaims: {},
  },
  flaggedUser: {
    uid: 'flagged-user-012',
    email: 'flagged@james-square.com',
    displayName: 'Flagged User',
    customClaims: {
      flagged: true,
    },
  },
}

export const mockPosts = [
  {
    id: 'post-1',
    title: 'Welcome to James Square',
    content: 'This is our first community post',
    authorId: mockUsers.admin.uid,
    authorName: mockUsers.admin.displayName,
    createdAt: new Date('2026-01-20T10:00:00Z'),
    updatedAt: new Date('2026-01-20T10:00:00Z'),
    reactionsCount: 5,
    commentsCount: 2,
  },
  {
    id: 'post-2',
    title: 'Pool maintenance update',
    content: 'The pool will be closed for maintenance next week',
    authorId: mockUsers.owner.uid,
    authorName: mockUsers.owner.displayName,
    createdAt: new Date('2026-01-22T14:30:00Z'),
    updatedAt: new Date('2026-01-22T14:30:00Z'),
    reactionsCount: 12,
    commentsCount: 8,
  },
  {
    id: 'post-3',
    title: 'Gym booking question',
    content: 'Does anyone know the gym hours on weekends?',
    authorId: mockUsers.regularUser.uid,
    authorName: mockUsers.regularUser.displayName,
    createdAt: new Date('2026-01-24T09:15:00Z'),
    updatedAt: new Date('2026-01-24T09:15:00Z'),
    reactionsCount: 3,
    commentsCount: 5,
  },
]

export const mockSessionCookies = {
  validAdmin: 'valid-admin-session-cookie',
  validOwner: 'valid-owner-session-cookie',
  validUser: 'valid-user-session-cookie',
  expired: 'expired-session-cookie',
  invalid: 'invalid-session-cookie',
}
