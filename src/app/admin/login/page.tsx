import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="min-h-dvh grid place-items-center bg-bg p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="text-2xl font-bold mt-1 mb-6">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
