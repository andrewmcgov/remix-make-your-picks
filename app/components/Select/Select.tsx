import {Option} from '~/utilities/types';
export interface SelectProps {
  name: string;
  label: string;
  labelHidden?: boolean;
  options: Option[];
  initialValue: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function Select({
  name,
  label,
  labelHidden = false,
  options,
  initialValue,
  onChange,
}: SelectProps) {
  const handleChange = onChange ?? undefined;
  return (
    <div className="Select">
      <label>
        <span className={labelHidden ? 'visuallyHidden' : ''}>{label}</span>
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
