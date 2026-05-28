interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function FormField({ label, name, type = 'text', value, onChange, error }: FormFieldProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="grow border-slate-950 border-b-2 bg-orange-50 outline-none"
      />
      {error && <span className="text-rose-600 text-sm">{error}</span>}
    </fieldset>
  );
}
