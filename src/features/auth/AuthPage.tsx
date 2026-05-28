import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

type Mode = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');

  const goHome = () => navigate('/');

  return (
    <div className="container mx-auto flex grow flex-col items-center gap-8 xl:max-w-6xl">
      <div className="flex gap-4 font-semibold">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={tabClass(mode === 'signin')}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={tabClass(mode === 'signup')}
        >
          Crear cuenta
        </button>
      </div>
      {mode === 'signin' ? <SignInForm onSuccess={goHome} /> : <SignUpForm onSuccess={goHome} />}
    </div>
  );
}

function tabClass(active: boolean): string {
  return active ? 'border-cyan-950 border-b-2 text-cyan-950' : 'text-zinc-500 hover:text-cyan-950';
}
