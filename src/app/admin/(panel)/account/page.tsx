import { PasswordForm } from "./PasswordForm";

export default function Account() {
  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">Account</h1>
      <PasswordForm />
    </div>
  );
}
