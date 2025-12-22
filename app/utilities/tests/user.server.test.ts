import {describe, it, expect, vi} from 'vitest';
import {mockDb} from '../../../tests/mocks/db';
import {mockSendPasswordResetEmail} from '../../../tests/setup';
import {
  logIn,
  signUp,
  updateUser,
  currentUser,
  logOut,
  requestReset,
  resetPassword,
} from '../user.server';
import {
  createMockRequest,
  createMockRequestWithCookie,
} from '../../../tests/helpers/request';
import {
  createUser,
  createUserWithPassword,
} from '../../../tests/factories/user';
import {userCookie} from '../../cookies';
import jwt from 'jsonwebtoken';

describe('logIn', () => {
  it('returns error when email is missing', async () => {
    const request = createMockRequest({password: 'somepassword'});
    const result = await logIn(request);

    expect(result).toEqual({email: 'Please provide an email address'});
  });

  it('returns error when password is missing', async () => {
    const request = createMockRequest({email: 'test@test.com'});
    const result = await logIn(request);

    expect(result).toEqual({password: 'Please provide a password'});
  });

  it('returns error when both email and password are missing', async () => {
    const request = createMockRequest({});
    const result = await logIn(request);

    expect(result).toEqual({
      email: 'Please provide an email address',
      password: 'Please provide a password',
    });
  });

  it('returns error when user is not found', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const request = createMockRequest({
      email: 'nonexistent@test.com',
      password: 'somepassword',
    });
    const result = await logIn(request);

    expect(result).toEqual({
      errors: {email: 'Could not find user with this email.'},
    });
    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: {email: 'nonexistent@test.com'},
    });
  });

  it('returns error when password is incorrect', async () => {
    const user = await createUserWithPassword('correctpassword', {
      email: 'test@test.com',
    });
    mockDb.user.findUnique.mockResolvedValue(user);

    const request = createMockRequest({
      email: 'test@test.com',
      password: 'wrongpassword',
    });
    const result = await logIn(request);

    expect(result).toEqual({
      errors: {password: 'Username or password were incorrect!'},
    });
  });

  it('returns redirect with cookie on successful login', async () => {
    const password = 'correctpassword';
    const user = await createUserWithPassword(password, {
      id: 1,
      email: 'success@test.com',
      username: 'successuser',
    });
    mockDb.user.findUnique.mockResolvedValue(user);

    const request = createMockRequest({
      email: 'success@test.com',
      password,
    });
    const result = await logIn(request);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');

    const setCookie = response.headers.get('Set-Cookie');
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain('picker_id');
  });

  it('trims whitespace from email', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const request = createMockRequest({
      email: '  spaced@test.com  ',
      password: 'somepassword',
    });
    await logIn(request);

    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: {email: 'spaced@test.com'},
    });
  });
});

describe('signUp', () => {
  it('returns error when email is missing', async () => {
    const request = createMockRequest({
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {email: 'Please provide an email'}});
  });

  it('returns error when password is missing', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {password: 'Please provide a password'}});
  });

  it('returns error when repeatpassword is missing', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
      password: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({
      errors: {repeatpassword: 'Please repeat your password'},
    });
  });

  it('returns error when username is missing', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {username: 'Please provide your email'}});
  });

  it('returns error when signup key is missing', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'password123',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {key: 'Please provide the signup key'}});
  });

  it('returns error when signup key is incorrect', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'wrong-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {key: 'Sign up key is incorrect'}});
  });

  it('returns error when passwords do not match', async () => {
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'differentpassword',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({
      errors: {repeatpassword: 'Passwords do not match!'},
    });
  });

  it('returns error when email is invalid', async () => {
    const request = createMockRequest({
      email: 'invalid-email',
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {email: 'Please provide a valid email!'}});
  });

  it('returns error when email already exists', async () => {
    const existingUser = createUser({email: 'existing@test.com'});
    mockDb.user.findUnique.mockResolvedValue(existingUser);

    const request = createMockRequest({
      email: 'existing@test.com',
      username: 'newuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({errors: {email: 'This user already exists!'}});
  });

  it('returns error when username already exists', async () => {
    // First findUnique for email returns null, second for username returns existing user
    mockDb.user.findUnique
      .mockResolvedValueOnce(null) // email check
      .mockResolvedValueOnce(createUser({username: 'existinguser'})); // username check

    const request = createMockRequest({
      email: 'new@test.com',
      username: 'existinguser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toEqual({
      errors: {username: 'This username already exists!'},
    });
  });

  it('creates user and returns redirect on successful signup', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    const newUser = createUser({
      id: 1,
      email: 'new@test.com',
      username: 'newuser',
    });
    mockDb.user.create.mockResolvedValue(newUser);

    const request = createMockRequest({
      email: 'new@test.com',
      username: 'newuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    const result = await signUp(request);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
    expect(response.headers.get('Set-Cookie')).toContain('picker_id');

    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'new@test.com',
        username: 'newuser',
      }),
    });
  });

  it('lowercases and trims email', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    const newUser = createUser({id: 1});
    mockDb.user.create.mockResolvedValue(newUser);

    const request = createMockRequest({
      email: '  TEST@TEST.COM  ',
      username: 'testuser',
      password: 'password123',
      repeatpassword: 'password123',
      key: 'test-signup-key',
    });
    await signUp(request);

    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@test.com',
      }),
    });
  });
});

describe('currentUser', () => {
  it('returns null when no cookie is present', async () => {
    const request = createMockRequest({});
    const result = await currentUser(request);

    expect(result).toBeNull();
  });

  it('returns null when cookie has no token', async () => {
    const cookie = await userCookie.serialize({});
    const request = createMockRequestWithCookie({}, cookie);
    const result = await currentUser(request);

    expect(result).toBeNull();
  });

  it('returns user when valid token is present', async () => {
    const user = createUser({
      id: 42,
      email: 'user@test.com',
      username: 'testuser',
      isAdmin: false,
    });
    const token = jwt.sign({id: 42}, process.env.APP_SECRET as string);
    const cookie = await userCookie.serialize({id: token});

    mockDb.user.findUnique.mockResolvedValue(user);

    const request = createMockRequestWithCookie({}, cookie);
    const result = await currentUser(request);

    // The mock returns the full user, but real Prisma would filter via select
    // We verify the function called findUnique with the correct select clause
    expect(result).toMatchObject({
      id: 42,
      email: 'user@test.com',
      username: 'testuser',
      isAdmin: false,
    });
    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: {id: 42},
      select: {username: true, email: true, id: true, isAdmin: true},
    });
  });

  it('returns null when user is not found in database', async () => {
    const token = jwt.sign({id: 999}, process.env.APP_SECRET as string);
    const cookie = await userCookie.serialize({id: token});

    mockDb.user.findUnique.mockResolvedValue(null);

    const request = createMockRequestWithCookie({}, cookie);
    const result = await currentUser(request);

    expect(result).toBeNull();
  });
});

describe('logOut', () => {
  it('returns redirect to home with expired cookie', async () => {
    const request = createMockRequest({});
    const result = await logOut(request);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');

    const setCookie = response.headers.get('Set-Cookie');
    expect(setCookie).toContain('picker_id');
    expect(setCookie).toContain('Max-Age=');
  });
});

describe('updateUser', () => {
  it('returns error when email is missing', async () => {
    const request = createMockRequest({username: 'newusername'});
    const result = await updateUser(request);

    expect(result).toEqual({errors: {email: 'Please provide an email'}});
  });

  it('returns error when username is missing', async () => {
    const request = createMockRequest({email: 'test@test.com'});
    const result = await updateUser(request);

    expect(result).toEqual({errors: {username: 'Please provide a username'}});
  });

  it('redirects to login when no user is logged in', async () => {
    // No cookie = no current user
    const request = createMockRequest({
      email: 'test@test.com',
      username: 'testuser',
    });
    const result = await updateUser(request);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/login');
  });

  it('returns error when email is invalid', async () => {
    // Set up a logged in user
    const user = createUser({id: 1});
    const token = jwt.sign({id: 1}, process.env.APP_SECRET as string);
    const cookie = await userCookie.serialize({id: token});

    mockDb.user.findUnique.mockResolvedValue(user);

    const request = createMockRequestWithCookie(
      {email: 'invalid-email', username: 'testuser'},
      cookie
    );
    const result = await updateUser(request);

    expect(result).toEqual({errors: {email: 'Please provide a valid email!'}});
  });

  it('updates user and redirects to account on success', async () => {
    const user = createUser({
      id: 1,
      email: 'old@test.com',
      username: 'olduser',
    });
    const token = jwt.sign({id: 1}, process.env.APP_SECRET as string);
    const cookie = await userCookie.serialize({id: token});

    // For currentUser call
    mockDb.user.findUnique.mockResolvedValue(user);

    const updatedUser = {...user, email: 'new@test.com', username: 'newuser'};
    mockDb.user.update.mockResolvedValue(updatedUser);

    const request = createMockRequestWithCookie(
      {email: 'new@test.com', username: 'newuser'},
      cookie
    );
    const result = await updateUser(request);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/account');

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: {id: 1},
      data: {email: 'new@test.com', username: 'newuser'},
    });
  });
});

describe('requestReset', () => {
  it('returns error when email is missing', async () => {
    const request = createMockRequest({});
    const result = await requestReset(request);

    expect(result).toEqual({email: 'Please provide an email address'});
  });

  it('returns error when user is not found', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const request = createMockRequest({email: 'nonexistent@test.com'});
    const result = await requestReset(request);

    expect(result).toEqual({
      errors: {email: 'No account with this email exists.'},
    });
  });

  it('creates reset token and sends email on success', async () => {
    const user = createUser({id: 1, email: 'user@test.com'});
    mockDb.user.findUnique.mockResolvedValue(user);
    mockDb.user.update.mockResolvedValue(user);

    const request = createMockRequest({email: 'user@test.com'});
    const result = await requestReset(request);

    expect(result).toEqual({success: true});

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: {id: 1},
      data: {
        resetToken: expect.any(String),
        resetExpiry: expect.any(String),
      },
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      'user@test.com',
      expect.any(String),
      1
    );
  });

  it('trims whitespace from email', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const request = createMockRequest({email: '  spaced@test.com  '});
    await requestReset(request);

    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: {email: 'spaced@test.com'},
    });
  });
});

describe('resetPassword', () => {
  it('returns error when user with token is not found', async () => {
    mockDb.user.findFirst.mockResolvedValue(null);

    const request = createMockRequest({
      password: 'newpassword',
      repeatpassword: 'newpassword',
    });
    const result = await resetPassword(request, '1', 'invalid-token');

    expect(result).toEqual({errors: {message: 'Reset token has expired.'}});
  });

  it('returns error when reset token has expired', async () => {
    const expiredTime = Date.now() - 1000; // 1 second ago
    const user = createUser({
      id: 1,
      resetToken: 'valid-token',
      resetExpiry: String(expiredTime),
    });
    mockDb.user.findFirst.mockResolvedValue(user);

    const request = createMockRequest({
      password: 'newpassword',
      repeatpassword: 'newpassword',
    });
    const result = await resetPassword(request, '1', 'valid-token');

    expect(result).toEqual({errors: {message: 'Reset token has expired.'}});
  });

  it('returns error when password is missing', async () => {
    const validExpiry = Date.now() + 3600000; // 1 hour from now
    const user = createUser({
      id: 1,
      resetToken: 'valid-token',
      resetExpiry: String(validExpiry),
    });
    mockDb.user.findFirst.mockResolvedValue(user);

    const request = createMockRequest({repeatpassword: 'newpassword'});
    const result = await resetPassword(request, '1', 'valid-token');

    expect(result).toEqual({
      errors: {message: 'Passwords must match and be more than 4 characters'},
    });
  });

  it('returns error when password is too short', async () => {
    const validExpiry = Date.now() + 3600000;
    const user = createUser({
      id: 1,
      resetToken: 'valid-token',
      resetExpiry: String(validExpiry),
    });
    mockDb.user.findFirst.mockResolvedValue(user);

    const request = createMockRequest({
      password: 'abc',
      repeatpassword: 'abc',
    });
    const result = await resetPassword(request, '1', 'valid-token');

    expect(result).toEqual({
      errors: {message: 'Passwords must match and be more than 4 characters'},
    });
  });

  it('updates password and redirects to login on success', async () => {
    const validExpiry = Date.now() + 3600000;
    const user = createUser({
      id: 1,
      resetToken: 'valid-token',
      resetExpiry: String(validExpiry),
    });
    mockDb.user.findFirst.mockResolvedValue(user);
    mockDb.user.update.mockResolvedValue(user);

    const request = createMockRequest({
      password: 'newpassword123',
      repeatpassword: 'newpassword123',
    });
    const result = await resetPassword(request, '1', 'valid-token');

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/login');

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: {id: 1},
      data: {
        resetToken: null,
        resetExpiry: null,
        password: expect.any(String),
      },
    });
  });

  it('looks up user with correct userId and token', async () => {
    mockDb.user.findFirst.mockResolvedValue(null);

    const request = createMockRequest({
      password: 'newpassword',
      repeatpassword: 'newpassword',
    });
    await resetPassword(request, '42', 'my-reset-token');

    expect(mockDb.user.findFirst).toHaveBeenCalledWith({
      where: {id: 42, resetToken: 'my-reset-token'},
    });
  });
});
