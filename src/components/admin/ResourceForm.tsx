"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { saveAction, type FormState } from "@/app/admin/actions";
import type { Field, Resource } from "@/lib/admin-config";
import { useToast } from "./Toast";

type Row = Record<string, unknown> | null;
type Options = Record<string, { value: string; label: string }[]>;

export function ResourceForm({ resource, row, id, options = {} }: { resource: Resource; row: Row; id: string | null; options?: Options }) {
  const bound = saveAction.bind(null, resource.key, id);
  const [state, action, pending] = useActionState<FormState, FormData>(bound, {});
  const toast = useToast();

  useEffect(() => {
    if (state.ok && state.message) toast(state.message, "ok");
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  const defaults = (f: Field) => {
    const v = row?.[f.name];
    if (f.type === "checkbox") return row ? Boolean(v) : f.name !== "isFeatured";
    if (f.type === "tags") return Array.isArray(v) ? v.join(", ") : "";
    if (f.type === "number") return v ?? 5;
    return (v as string | null | undefined) ?? "";
  };

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      {resource.fields.map((f) => {
        const err = state.fieldErrors?.[f.name];
        const opts = f.options ?? options[f.name];
        return (
          <div key={f.name}>
            {f.type === "checkbox" ? (
              <label className="flex items-center gap-3 text-sm font-medium">
                <input type="checkbox" name={f.name} defaultChecked={defaults(f) as boolean} className="size-4 accent-[#a58b65]" />
                {f.label}
              </label>
            ) : (
              <>
                <label htmlFor={f.name} className="block text-sm font-semibold mb-1.5">
                  {f.label} {f.required && <span className="text-red-600">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={f.name} name={f.name} rows={f.name === "story" || f.name === "aboutBody" || f.name === "caseStudy" ? 8 : 4} defaultValue={defaults(f) as string} className="input" />
                ) : f.type === "select" ? (
                  <select id={f.name} name={f.name} defaultValue={defaults(f) as string} className="input">
                    {f.name === "categoryId" && <option value="">No category</option>}
                    {opts?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === "image" ? (
                  <ImageInput name={f.name} current={(row?.[f.name] as string | null) ?? null} />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type === "number" ? "number" : f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
                    min={f.type === "number" ? 1 : undefined}
                    max={f.type === "number" ? 5 : undefined}
                    defaultValue={defaults(f) as string | number}
                    className="input"
                  />
                )}
              </>
            )}
            {f.help && <p className="text-xs text-muted mt-1">{f.help}</p>}
            {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
          </div>
        );
      })}
      <button disabled={pending} className="btn btn-dark disabled:opacity-60">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function ImageInput({ name, current }: { name: string; current: string | null }) {
  const [preview, setPreview] = useState<string | null>(current);
  const [removed, setRemoved] = useState(false);
  return (
    <div className="space-y-2">
      {preview && !removed && (
        <Image src={preview} alt="Preview" width={160} height={160} unoptimized className="h-32 w-auto rounded-lg border border-line object-contain bg-white" />
      )}
      <input type="hidden" name={`${name}__current`} value={current ?? ""} />
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        className="block text-sm"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            setPreview(URL.createObjectURL(f));
            setRemoved(false);
          }
        }}
      />
      {current && (
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" name={`${name}__remove`} onChange={(e) => setRemoved(e.target.checked)} /> Remove current image
        </label>
      )}
      <p className="text-xs text-muted">JPG, PNG, WebP, AVIF or SVG up to 4 MB.</p>
    </div>
  );
}
