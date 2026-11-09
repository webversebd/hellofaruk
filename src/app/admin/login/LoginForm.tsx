"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <input name="email" type="email" required autoComplete="username" placeholder="Email" className="input" />
      <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="input" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="btn btn-dark w-full disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
