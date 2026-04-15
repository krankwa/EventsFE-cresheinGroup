import type { LucideIcon } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ProfileFieldProps {
  label: string;
  icon?: LucideIcon;
  error?: string | undefined;
  description?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

export function ProfileField({
  label,
  icon: Icon,
  error,
  description,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}: ProfileFieldProps) {
  return (
    <Field orientation="vertical">
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          )}
          <Input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={Icon ? "pl-9" : ""}
          />
        </div>
        {description && !error && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}