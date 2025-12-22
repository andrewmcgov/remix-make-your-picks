import {vi, beforeEach} from 'vitest';
import {mockDb, resetMockDb} from './mocks/db';
import '@testing-library/jest-dom';

// Mock the db.server module to use our mock Prisma client
vi.mock('~/utilities/db.server', () => ({
  db: mockDb,
}));

// Mock the mail.server module
export const mockSendPasswordResetEmail = vi.fn();
vi.mock('~/utilities/mail.server', () => ({
  sendPasswordResetEmail: mockSendPasswordResetEmail,
}));

// Reset all mocks before each test to ensure test isolation
beforeEach(() => {
  resetMockDb();
  mockSendPasswordResetEmail.mockReset();
});

// Set required environment variables for tests
process.env.APP_SECRET = 'test-secret-key';
process.env.SIGNUP_KEY = 'test-signup-key';
