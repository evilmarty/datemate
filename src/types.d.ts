export interface CopyButtonProps {
  value: string;
  fieldName: string;
  size?: number;
  className?: string | null;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: string;
  value: any;
  options?: string[] | Record<string, string>;
  className?: string | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export interface FieldProps extends InputProps {
  label?: string;
  align?: "left" | "center" | "right";
  fieldName?: string;
  className?: string;
  copyButton?: boolean;
}
