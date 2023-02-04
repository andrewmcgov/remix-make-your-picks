export interface TextFieldProps {
  name: string;
  label: string;
  type: string;
  defaultValue?: string;
  error?: string;
  pattern?: string;
  min?: string;
}

export function TextField({
  name,
  type,
  label,
  defaultValue,
  error,
  pattern,
  min,
}: TextFieldProps) {
  return (
    <div className="TextField">
      <label>
        {label}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          pattern={pattern}
          min={min}
        />
      </label>
      {error && <p className="TextField--error">{error}</p>}
    </div>
  );
}
