import { SignInForm } from '@/features/auth/SignInForm';
import { useAuthStore } from '@/features/auth/auth.store';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from './test-utils';

describe('SignInForm', () => {
  it('stores the token and calls onSuccess with valid credentials', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignInForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'pikapika');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useAuthStore.getState().token).toBe('fake.jwt.token');
  });

  it('shows an error and keeps no token on invalid credentials', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignInForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'wrong-pass');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/credenciales invalidas/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('validates the email format client-side before calling the api', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignInForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('email'), 'not-an-email');
    await userEvent.type(screen.getByLabelText('password'), 'whatever');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/email invalido/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
