import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/features/auth/auth.store';
import { HomePage } from '@/pages/HomePage';
import { renderWithProviders, screen, waitFor } from './test-utils';

describe('HomePage', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 'fake.jwt.token' });
  });

  it('renders the pokemon from the user pokedex via the backend proxy', async () => {
    renderWithProviders(<HomePage />);

    // pikachu is in testUser.pokedex and resolved through /api/pokemon/:name
    await waitFor(() => expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0));
  });

  it('shows the create-team form when the user has no team', async () => {
    renderWithProviders(<HomePage />);

    expect(await screen.findByLabelText(/crear equipo/i)).toBeInTheDocument();
  });
});
