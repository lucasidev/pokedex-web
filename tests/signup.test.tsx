import { SignUpForm } from '@/features/auth/SignUpForm';
import { useAuthStore } from '@/features/auth/auth.store';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from './test-utils';

describe('SignUpForm', () => {
  it('stores the token and calls onSuccess with valid input', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignUpForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('name'), 'Ash Ketchum');
    await userEvent.type(screen.getByLabelText('username'), 'ash');
    await userEvent.type(screen.getByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'pikapika1');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useAuthStore.getState().token).toBe('fake.jwt.token');
  });

  it('rejects a short username before calling the api', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignUpForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('name'), 'Ash');
    await userEvent.type(screen.getByLabelText('username'), 'a');
    await userEvent.type(screen.getByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'pikapika1');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/minimo 3 caracteres/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('rejects a short password before calling the api', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<SignUpForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText('name'), 'Ash');
    await userEvent.type(screen.getByLabelText('username'), 'ash');
    await userEvent.type(screen.getByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'short');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/minimo 8 caracteres/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
