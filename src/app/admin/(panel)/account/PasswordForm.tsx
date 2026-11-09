"use client";

import { useActionState, useEffect } from "react";
import { changePasswordAction, type FormState } from "../../actions";
import { useToast } from "@/components/admin/Toast";

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, {});
  const toast = useToast();
  useEffect(() => {
    if (state.ok) toast(state.message ?? "Saved", "ok");
    if (state.error) toast(state.error, "error");
  }, [state, toast]);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-semibold">Current password<input name="current" type="password" autoComplete="current-password" required className="input mt-1.5" /></label>
      <label className="block text-sm font-semibold">New password (12+ characters)<input name="next" type="password" autoComplete="new-password" minLength={12} required className="input mt-1.5" /></label>
      <button disabled={pending} className="btn btn-dark disabled:opacity-60">{pending ? "Updating…" : "Change password"}</button>
    </form>
  );
}
