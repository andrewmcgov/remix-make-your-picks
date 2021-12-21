import {useEffect, useRef} from 'react';

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
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   if (type === 'date' && defaultValue) {
  //     // inputRef?.current?.value = defaultValue;

  //     console.log(
  //       `setting value to ${defaultValue}`, inputRef?.current
  //     );
  //   }
  // }, []);

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
