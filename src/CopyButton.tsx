import React, { useContext } from "react";
import { Copy, Check } from "lucide-react";
import CopyContext from "./CopyContext";
import type { CopyButtonProps } from "./types";

const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  fieldName,
  size = 16,
  className = null,
}) => {
  const [copiedField, setCopiedField] = useContext(CopyContext);
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <button
      onClick={() => copyToClipboard(value, fieldName)}
      className={`${className} text-gray-500 hover:text-blue-500 transition-colors`}
      title="Copy to clipboard"
    >
      {copiedField === fieldName ? (
        <Check size={size} className="text-green-500" />
      ) : (
        <Copy size={size} />
      )}
    </button>
  );
};

export default CopyButton;
