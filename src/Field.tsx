import React from "react";
import Input from "./Input";
import CopyButton from "./CopyButton";
import type { FieldProps } from "./types";

const ALIGNMENTS = {
  left: "text-left [text-align-last:left]",
  center: "text-center [text-align-last:center]",
  right: "text-right [text-align-last:right]",
};

const Field: React.FC<FieldProps> = ({
  value,
  label = undefined,
  align = "right",
  fieldName = null,
  className = null,
  copyButton = true,
  ...rest
}) => (
  <div
    className={`${className} flex items-center text-gray-900 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-900 rounded-md focus-within:ring-2 focus-within:text-black dark:focus-within:text-gray-300 focus-within:ring-blue-500 dark:focus-within:ring-blue-700`}
  >
    {label && (
      <label
        htmlFor={fieldName || label}
        className="text-sm font-medium text-gray-400 dark:text-gray-500 m-1 px-1 py-2"
      >
        {label}
      </label>
    )}
    <Input
      id={fieldName || label}
      value={value}
      className={`${ALIGNMENTS[align]} w-full`}
      {...rest}
    />
    {copyButton && (
      <CopyButton
        value={String(value)}
        fieldName={fieldName || label || ""}
        className="m-1 p-1"
      />
    )}
  </div>
);

export default Field;
