import {describe, it, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createRoutesStub} from 'react-router';
import LoginRoute, {action} from '~/routes/login';
import {mockDb} from '../../../tests/mocks/db';
import {createUserWithPassword} from '../../../tests/factories/user';

// Create a routes stub for the login route
function renderLoginRoute() {
  const Stub = createRoutesStub([
    {
      path: '/login',
      Component: LoginRoute,
      action: action,
    },
    {
      path: '/',
      Component: () => <div>Home Page</div>,
    },
  ]);

  return render(<Stub initialEntries={['/login']} />);
}

describe('Login Route', () => {
  it('renders "Reset your password" link pointing to /request-reset', () => {
    renderLoginRoute();

    const resetLink = screen.getByRole('link', {
      name: /reset your password/i,
    });
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute('href', '/request-reset');
  });

  describe('Form Validation', () => {
    it('shows error when email field is empty on submit', async () => {
      const user = userEvent.setup();
      renderLoginRoute();

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {name: /log in/i});

      await user.type(passwordInput, 'somepassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please provide an email address/i)
        ).toBeInTheDocument();
      });
    });

    it('shows error when password field is empty on submit', async () => {
      const user = userEvent.setup();
      renderLoginRoute();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {name: /log in/i});

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please provide a password/i)
        ).toBeInTheDocument();
      });
    });

    it('shows errors for both fields when both are empty', async () => {
      const user = userEvent.setup();
      renderLoginRoute();

      const submitButton = screen.getByRole('button', {name: /log in/i});
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please provide an email address/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/please provide a password/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Authentication', () => {
    it('shows error when user is not found', async () => {
      const user = userEvent.setup();
      mockDb.user.findUnique.mockResolvedValue(null);

      renderLoginRoute();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {name: /log in/i});

      await user.type(emailInput, 'nonexistent@test.com');
      await user.type(passwordInput, 'somepassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/could not find user with this email/i)
        ).toBeInTheDocument();
      });

      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: {email: 'nonexistent@test.com'},
      });
    });

    it('shows error when password is invalid', async () => {
      const user = userEvent.setup();
      const testUser = await createUserWithPassword('correctpassword', {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
      });
      mockDb.user.findUnique.mockResolvedValue(testUser);

      renderLoginRoute();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {name: /log in/i});

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/username or password were incorrect/i)
        ).toBeInTheDocument();
      });
    });

    it('successfully submits with valid credentials and navigates to home page', async () => {
      const user = userEvent.setup();
      const password = 'correctpassword';
      const testUser = await createUserWithPassword(password, {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
      });
      mockDb.user.findUnique.mockResolvedValue(testUser);

      renderLoginRoute();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {name: /log in/i});

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, password);
      await user.click(submitButton);

      // After successful login, we should be redirected to home
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });
  });
});
