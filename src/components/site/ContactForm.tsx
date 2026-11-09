"use client";

import { useActionState, useRef } from "react";
import { submitInquiry, type ContactState } from "@/app/contact-action";

const TYPES = ["Shopify Store Development", "Theme Customization", "E-commerce Website", "UI/UX Design", "Store Optimization", "Consultation", "Other"];
const BUDGETS = ["Under $500", "$500 – $1,000", "$1,000 – $3,000", "$3,000 – $5,000", "$5,000+", "Not sure yet"];

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitInquiry, {});
  const started = useRef(Date.now());
  const err = (k: string) => state.fieldErrors?.[k];

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8" role="status">
        <h3 className="text-xl font-bold">Thank you — message received.</h3>
        <p className="mt-2 text-muted">I'll get back to you as soon as I can, usually within one business day.</p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-6 md:p-8 space-y-4" noValidate>
      <input type="hidden" name="t" value={started.current} />
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" error={err("name")}><input name="name" required autoComplete="name" className="input" /></Field>
        <Field label="Email address" error={err("email")}><input name="email" type="email" required autoComplete="email" className="input" /></Field>
        <Field label="Phone number" error={err("phone")}><input name="phone" type="tel" autoComplete="tel" className="input" /></Field>
        <Field label="Project type" error={err("projectType")}>
          <select name="projectType" className="input" defaultValue="">
            <option value="" disabled>Select…</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Budget range (optional)" error={err("budget")}>
        <select name="budget" className="input" defaultValue="">
          <option value="">Prefer not to say</option>
          {BUDGETS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Message" error={err("message")}><textarea name="message" required rows={5} className="input" /></Field>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </>
      )}
      {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
      <button disabled={pending} className="btn btn-dark w-full sm:w-auto disabled:opacity-60">{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <span className="block mt-1.5 font-normal">{children}</span>
      {error && <span className="block text-xs text-red-600 mt-1 font-normal">{error}</span>}
    </label>
  );
}
