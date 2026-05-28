import { z } from 'zod';

// VITE_ vars are inlined at build time. Default base URL is relative
// (/api) so dev (vite proxy) and prod (nginx proxy) both work without
// hardcoding the backend origin.
const schema = z.object({
  VITE_API_URL: z.string().default('/api'),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  // Surface config problems at boot rather than on the first request.
  console.error('Invalid frontend env:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid frontend environment configuration');
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
} as const;
