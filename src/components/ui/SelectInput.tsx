interface SelectInputProps {
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function SelectInput({
  options,
  value,
  onChange,
  label,
  required,
  error,
  placeholder = 'Select an option',
  disabled,
  id,
  ...props
}: Readonly<SelectInputProps>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        required={required}
        className="w-full rounded-md border border-gray-700 px-3 py-2 text-black outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  );
}
