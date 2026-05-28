import { z } from 'zod';

// Mirrors the backend zod schemas so the client rejects bad input before
// the round-trip and shows field-level messages.
export const signInSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  username: z.string().min(3, 'Minimo 3 caracteres').max(30),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres').max(72),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
