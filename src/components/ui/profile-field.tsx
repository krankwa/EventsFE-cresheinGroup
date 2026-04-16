import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <Field orientation="vertical">
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="relative group">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10 group-focus-within:text-primary transition-colors" />
          )}
          <Input
            type={isPasswordField && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={Icon ? "pl-9 pr-10" : "pr-10"}
          />
          {isPasswordField && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-primary hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        {description && !error && (
          <FieldDescription>{description}</FieldDescription>
        )}
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}
