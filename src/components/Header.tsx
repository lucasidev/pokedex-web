import { useMe, useSignOut } from '@/features/auth/auth.queries';
import { useAuthStore } from '@/features/auth/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';

export function Header() {
  const token = useAuthStore((s) => s.token);
  const { data: user } = useMe();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleLogOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <header className="container mx-auto h-16 border-cyan-950 border-b-2 text-cyan-950 xl:max-w-6xl">
      <div className="flex h-full w-full items-center justify-between">
        <Link to="/" className="cursor-pointer font-bold text-2xl">
          pokedexApp
        </Link>
        <div className="flex items-center justify-center gap-2">
          {token && user ? (
            <>
              <span>{user.username}</span>
              <Button color="warning" onClick={handleLogOut}>
                Log out
              </Button>
            </>
          ) : (
            <span>Bienvenido</span>
          )}
        </div>
      </div>
    </header>
  );
}
