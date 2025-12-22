import type {User} from '@prisma/client';

let userIdCounter = 1;

/**
 * Creates a mock User object for testing
 */
export function createUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? userIdCounter++;

  return {
    id,
    email: `user${id}@test.com`,
    username: `testuser${id}`,
    password: '$2b$10$hashedpassword', // bcrypt hash placeholder
    isAdmin: false,
    resetToken: null,
    resetExpiry: null,
    ...overrides,
  };
}

/**
 * Creates a user with a known password hash for login testing
 * The password "testpassword" hashes to this value
 */
export async function createUserWithPassword(
  password: string,
  overrides: Partial<User> = {}
): Promise<User> {
  // Import bcrypt dynamically to hash the password
  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);

  return createUser({
    password: hashedPassword,
    ...overrides,
  });
}

/**
 * Reset the user ID counter (useful for test isolation)
 */
export function resetUserFactory() {
  userIdCounter = 1;
}
