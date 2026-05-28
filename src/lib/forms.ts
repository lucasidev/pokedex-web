// Collapses zod's flatten().fieldErrors (string[] per field) into the
// first message per field for simple inline display.
export function fieldErrors(input: Record<string, string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value?.[0]) {
      out[key] = value[0];
    }
  }
  return out;
}
