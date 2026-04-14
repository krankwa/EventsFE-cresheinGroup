import { AuthSection } from "../features/authentication/AuthSection";
import { LoginForm } from "../components/organisms/LoginForm";
import { RegisterForm } from "../components/organisms/RegisterForm";

export function LoginPage() {
  return (
    <AuthSection initialTab="login">
      <AuthSection.Header />
      <AuthSection.Tabs />
      <AuthSection.Content
        loginComponent={<LoginForm />}
        registerComponent={<RegisterForm />}
      />
      {/* <AuthSection.Footer /> */}
    </AuthSection>
  );
}
