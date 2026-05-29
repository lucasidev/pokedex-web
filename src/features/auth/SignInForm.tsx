import { type FormEvent, useState } from 'react';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { fieldErrors } from '@/lib/forms';
import { useSignIn } from './auth.queries';
import { signInSchema } from './auth.schemas';

interface SignInFormProps {
  onSuccess: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const signIn = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.flatten().fieldErrors));
      return;
    }
    setErrors({});
    signIn.mutate(parsed.data, { onSuccess });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-96 flex-col gap-4 border-2 border-slate-950 px-16 py-8"
    >
      <FormField
        label="email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
      />
      <FormField
        label="password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
      />
      {signIn.isError && <p className="text-rose-600 text-sm">Credenciales invalidas</p>}
      <div className="flex justify-end">
        <Button type="submit" color="positive" disabled={signIn.isPending}>
          {signIn.isPending ? 'Ingresando...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
