import { useAuthStore } from '@/features/auth/auth.store';
import { HomePage } from '@/pages/HomePage';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders, screen, waitFor } from './test-utils';

describe('HomePage mutations', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 'fake.jwt.token' });
  });

  it('catches a pokemon and shows it in the pokedex', async () => {
    renderWithProviders(<HomePage />);

    await screen.findByLabelText(/capturar pokemon/i);
    await userEvent.type(screen.getByLabelText(/capturar pokemon/i), 'bulbasaur');
    await userEvent.click(screen.getByRole('button', { name: /^capturar$/i }));

    await waitFor(() => expect(screen.getAllByText('bulbasaur').length).toBeGreaterThan(0));
  });

  it('creates a team and then can delete it', async () => {
    renderWithProviders(<HomePage />);

    const teamInput = await screen.findByLabelText(/crear equipo/i);
    await userEvent.type(teamInput, 'Kanto');
    await userEvent.click(screen.getByRole('button', { name: /^crear$/i }));

    expect(await screen.findByText('Kanto')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /eliminar equipo/i }));

    await waitFor(() => expect(screen.queryByText('Kanto')).not.toBeInTheDocument());
    expect(screen.getByLabelText(/crear equipo/i)).toBeInTheDocument();
  });
});
