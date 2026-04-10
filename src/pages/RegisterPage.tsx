import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/form-schema/login-schema";

//newfunc
import { useRegister } from "../features/authentication/useRegister";

export function RegisterPage() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  //newfunc
  const { register, isPending } = useRegister();

  function onSubmit(data: z.infer<typeof registerSchema>) {
    register({
      name: data.email.split("@")[0], // Fallback if name is missing from UI
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  }

  return (
    <div className="min-h-screen bg-[#E6e6e6] flex items-center justify-center px-4">
      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-1 rounded-2xl overflow-hidden shadow-xl border border-[#dde1e8]">
        {/* Right panel — white card 70% of layout */}
        <Card className=" bg-[#f6f6f7] border-0 rounded-none shadow-none">
          <CardHeader className="px-8 pt-10 pb-2">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-5 h-5 rounded-full bg-[#1b2a4a]" />
              <span className="text-[11px] tracking-[0.2em] text-[#1b2a4a] uppercase font-semibold">
                Live Events Portal
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#1e293b]">Register</h1>
            <p className="text-sm text-[#64748b] mt-1">
              Sign up to manage your events & tickets.
            </p>
          </CardHeader>

          <CardContent className="px-8 pt-6">
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="space-y-5">
                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="text-xs font-semibold tracking-widest text-[#475569] uppercase"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        disabled={isPending}
                        placeholder="name@example.com"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                        className="mt-1.5 bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#1b2a4a] focus:ring-[#1b2a4a]/10 h-11 rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="password"
                          className="text-xs font-semibold tracking-widest text-[#475569] uppercase"
                        >
                          Password
                        </FieldLabel>
                      </div>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        disabled={isPending}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                        className="mt-1.5 bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#1b2a4a] focus:ring-[#1b2a4a]/10 h-11 rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="password"
                          className="text-xs font-semibold tracking-widest text-[#475569] uppercase"
                        >
                          Confirm Password
                        </FieldLabel>
                      </div>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        disabled={isPending}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                        className="mt-1.5 bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#1b2a4a] focus:ring-[#1b2a4a]/10 h-11 rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="px-8 pb-10 pt-4 flex flex-col gap-4">
            <Button
              type="submit"
              form="login-form"
              disabled={isPending}
              className="w-full h-11 font-bold tracking-widest uppercase text-sm rounded-lg bg-[#1b2a4a] text-white hover:bg-[#253d6b] transition-colors"
            >
              Sign In
            </Button>
            <p className="text-xs text-center text-[#94a3b8]">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-[#2e4d8a] hover:text-[#1b2a4a] transition-colors font-medium"
              >
                Register here
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
