export interface TextFieldProps {
  name: string;
  label: string;
  type: string;
  error?: string;
}

export function TextField({name, type, label, error}: TextFieldProps) {
  return (
    <div className="TextField">
      <label>
        {label}
        <input type={type} name={name} />
      </label>
      {error && <p className="TextField--error">{error}</p>}
    </div>
  );
}
