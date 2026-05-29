import { type FormEvent, useState } from 'react';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { fieldErrors } from '@/lib/forms';
import { useSignUp } from './auth.queries';
import { signUpSchema } from './auth.schemas';

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const signUp = useSignUp();
  const [values, setValues] = useState({ name: '', username: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.flatten().fieldErrors));
      return;
    }
    setErrors({});
    signUp.mutate(parsed.data, { onSuccess });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-96 flex-col gap-4 border-2 border-slate-950 px-16 py-8"
    >
      <FormField
        label="name"
        name="name"
        value={values.name}
        onChange={set('name')}
        error={errors.name}
      />
      <FormField
        label="username"
        name="username"
        value={values.username}
        onChange={set('username')}
        error={errors.username}
      />
      <FormField
        label="email"
        name="email"
        type="email"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
      />
      <FormField
        label="password"
        name="password"
        type="password"
        value={values.password}
        onChange={set('password')}
        error={errors.password}
      />
      {signUp.isError && <p className="text-rose-600 text-sm">No se pudo crear la cuenta</p>}
      <div className="flex justify-end">
        <Button type="submit" color="positive" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creando...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
}
