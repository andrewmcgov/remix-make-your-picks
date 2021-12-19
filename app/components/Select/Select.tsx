export interface SelectProps {
  name: string;
  label: string;
  options: {value: string; label: string}[];
  initialValue: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function Select({
  name,
  label,
  options,
  initialValue,
  onChange,
}: SelectProps) {
  const handleChange = onChange ?? undefined;
  return (
    <div className="Select">
      <label>
        {label}
        <select
          name={name}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          defaultValue={initialValue}
        >
          {options.map((selectOption) => (
            <option key={selectOption.value} value={selectOption.value}>
              {selectOption.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
