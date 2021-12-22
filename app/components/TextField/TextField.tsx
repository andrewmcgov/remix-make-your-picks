export interface TextFieldProps {
  name: string;
  label: string;
  type: string;
  defaultValue?: string;
  error?: string;
}

export function TextField({
  name,
  type,
  label,
  defaultValue,
  error,
}: TextFieldProps) {
  return (
    <div className="TextField">
      <label>
        {label}
        <input type={type} name={name} defaultValue={defaultValue} />
      </label>
      {error && <p className="TextField--error">{error}</p>}
    </div>
  );
}
