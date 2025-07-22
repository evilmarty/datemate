import React from "react";
import type { InputProps } from "./types";

const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  onChange = undefined,
  options = null,
  valueKeys = false,
  className = null,
  ...rest
}) => {
  if (options !== null) {
    return (
      <select
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
        className={`${className} appearance-none px-3 py-2 bg-transparent text-inherit border-0 outline-0 flex-1`}
      >
        {normalizeOptions(options, valueKeys).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    );
  } else {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        className={`${className} px-3 py-2 bg-transparent text-inherit border-0 outline-0 flex-1`}
        {...rest}
      />
    );
  }
};

function normalizeOptions(
  options: string[] | Record<string, string>,
  valueKeys: boolean = false,
): [string | number, string][] {
  if (Array.isArray(options)) {
    return options.map((v, k) => [valueKeys ? v : k, v]);
  }
  return Object.entries(options);
}

export default Input;
