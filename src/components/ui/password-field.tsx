import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
    label?: string;
    error?: string | undefined;
    description?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    autoComplete?: string;
}

export function PasswordField({
    label,
    error,
    description,
    value,
    onChange,
    placeholder,
    disabled,
    className,
    autoComplete,
}: PasswordFieldProps) {
    const [show, setShow] = useState(false);

    return (
        <Field orientation="vertical">
            {label && <FieldLabel>{label}</FieldLabel>}
            <FieldContent>
                <div className="relative">
                    <Input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={cn("pr-10", className)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShow((s) => !s)}
                        tabIndex={-1}
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {description && !error && <FieldDescription>{description}</FieldDescription>}
                {error && <FieldError>{error}</FieldError>}
            </FieldContent>
        </Field>
    );
}