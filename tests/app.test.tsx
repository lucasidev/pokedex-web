import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '@/App';
import { useAuthStore } from '@/features/auth/auth.store';
import { renderWithProviders, screen, waitFor } from './test-utils';

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null });
  });

  it('redirects an unauthenticated visitor to the auth page', async () => {
    renderWithProviders(<App />, { initialEntries: ['/'] });

    expect(await screen.findByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido/)).toBeInTheDocument();
    expect(screen.getByText(/Santo Tomas de Aquino/i)).toBeInTheDocument();
  });

  it('renders the home page with the pokedex when authenticated', async () => {
    useAuthStore.setState({ token: 'fake.jwt.token' });

    renderWithProviders(<App />, { initialEntries: ['/'] });

    await waitFor(() => expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0));
    expect(screen.getByText('ash')).toBeInTheDocument();
    expect(await screen.findByLabelText(/crear equipo/i)).toBeInTheDocument();
  });

  it('shows the not-found page for an unknown route', async () => {
    useAuthStore.setState({ token: 'fake.jwt.token' });

    renderWithProviders(<App />, { initialEntries: ['/does-not-exist'] });

    expect(await screen.findByText('404')).toBeInTheDocument();
  });

  it('signs in from the auth page and lands on the home page', async () => {
    renderWithProviders(<App />, { initialEntries: ['/'] });

    await userEvent.type(await screen.findByLabelText('email'), 'ash@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'pikapika');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0));
  });
});
