export interface CopyButtonProps {
  value: string;
  fieldName: string;
  size?: number;
  className?: string | null;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  value: any;
  options?: string[] | Record<string, string>;
  valueKeys?: boolean;
  className?: string | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export interface FieldProps extends InputProps {
  label: string;
  copyValue?: any;
  fieldName?: string;
}
