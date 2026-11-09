"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, hashPassword, requireAdmin, verifyPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { uploadImage } from "@/lib/cloudinary";
import { resources, type Field } from "@/lib/admin-config";
import { slugify } from "@/lib/utils";

export type FormState = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Delegate = any;
const delegate = (model: string): Delegate => (db as unknown as Record<string, Delegate>)[model];

// Optional fields whose DB column is NOT NULL: store "" instead of null.
const NON_NULL_OPTIONAL = new Set(["value", "url"]);

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

/* ---------------------------- Auth ---------------------------- */

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse({
    email: String(fd.get("email") ?? "").trim().toLowerCase(),
    password: String(fd.get("password") ?? ""),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  const limitEmail = rateLimit(`login-email:${parsed.data.email}`, 8, 15 * 60 * 1000);
  if (!limit.ok || !limitEmail.ok) return { error: "Too many attempts. Try again in a few minutes." };

  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  // Compare against a dummy hash when user is missing to keep timing similar.
  const hash = user?.passwordHash ?? "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5J1y6a1uXx8o1l7Z5s1m8k0v4q2rX7S";
  const valid = await verifyPassword(parsed.data.password, hash);
  if (!user || !valid) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = z
    .object({ current: z.string().min(1), next: z.string().min(12, "Use at least 12 characters.") })
    .safeParse({ current: String(fd.get("current") ?? ""), next: String(fd.get("next") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) return { error: "Current password is incorrect." };
  await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(parsed.data.next) } });
  return { ok: true, message: "Password updated." };
}

/* ------------------------- Generic CRUD ------------------------- */

function fieldSchema(f: Field): z.ZodType<unknown> {
  const required = !!f.required;
  switch (f.type) {
    case "checkbox":
      return z.boolean();
    case "number":
      return z.coerce.number().int().min(1).max(5);
    case "url":
      return required
        ? z.string().trim().url("Enter a full URL starting with https://").refine((v) => /^https?:\/\//i.test(v), "Must start with http(s)://")
        : z.string().trim().refine((v) => v === "" || (/^https?:\/\//i.test(v) && URL.canParse(v)), "Enter a full URL starting with https://");
    case "email":
      return required ? z.string().trim().email("Enter a valid email") : z.string().trim().refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email");
    case "tags":
      return z.string().max(500);
    default: {
      const max = f.max ?? (f.type === "textarea" ? 10000 : 500);
      const base = z.string().trim().max(max);
      return required ? base.min(1, "Required") : base;
    }
  }
}

export async function saveAction(resourceKey: string, id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const res = resources[resourceKey];
  if (!res) return { error: "Unknown resource." };

  const data: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};

  for (const f of res.fields) {
    if (f.type === "image") {
      const file = fd.get(f.name);
      const current = String(fd.get(`${f.name}__current`) ?? "");
      if (fd.get(`${f.name}__remove`) === "on") {
        data[f.name] = null;
      } else if (file instanceof File && file.size > 0) {
        try {
          data[f.name] = await uploadImage(file);
        } catch (e) {
          fieldErrors[f.name] = e instanceof Error ? e.message : "Upload failed.";
        }
      } else {
        data[f.name] = current || null;
      }
      continue;
    }

    if (f.type === "checkbox") {
      data[f.name] = fd.get(f.name) === "on";
      continue;
    }

    const raw = f.type === "number" ? String(fd.get(f.name) ?? "5") : String(fd.get(f.name) ?? "");
    const parsed = fieldSchema(f).safeParse(raw);
    if (!parsed.success) {
      fieldErrors[f.name] = parsed.error.issues[0]?.message ?? "Invalid value";
      continue;
    }
    const v = parsed.data;
    if (f.type === "tags") {
      data[f.name] = String(v).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20);
    } else if (f.type === "number") {
      data[f.name] = v;
    } else if (typeof v === "string" && v === "" && !f.required) {
      data[f.name] = NON_NULL_OPTIONAL.has(f.name) ? "" : null;
    } else {
      data[f.name] = v;
    }
  }

  if (res.key === "settings" && typeof data.accentColor === "string" && !/^#[0-9a-fA-F]{6}$/.test(data.accentColor)) {
    fieldErrors.accentColor = "Use a hex color like #A58B65";
  }

  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  const model = delegate(res.model);

  try {
    if (res.singleton) {
      const existing = await model.findFirst();
      if (existing) await model.update({ where: { id: existing.id }, data });
      else await model.create({ data });
    } else if (id) {
      if (res.slugFrom && data[res.slugFrom]) data.slug = await uniqueSlug(model, String(data[res.slugFrom]), id);
      await model.update({ where: { id }, data });
    } else {
      if (!res.canCreate) return { error: "Creating is not allowed here." };
      if (res.slugFrom) data.slug = await uniqueSlug(model, String(data[res.slugFrom]));
      if (res.orderField) {
        const last = await model.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
        data.sortOrder = (last?.sortOrder ?? -1) + 1;
      }
      await model.create({ data });
    }
  } catch (e) {
    console.error("saveAction", resourceKey, e);
    return { error: "Could not save. Check the values and try again." };
  }

  refresh();
  if (!res.singleton && !id) redirect(`/admin/${res.key}`);
  return { ok: true, message: "Saved." };
}

async function uniqueSlug(model: Delegate, source: string, excludeId?: string) {
  const base = slugify(source) || "item";
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const hit = await model.findUnique({ where: { slug } });
    if (!hit || hit.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function deleteAction(resourceKey: string, id: string) {
  await requireAdmin();
  const res = resources[resourceKey];
  if (!res?.canDelete) return;
  await delegate(res.model).delete({ where: { id } });
  refresh();
}

export async function moveAction(resourceKey: string, id: string, dir: "up" | "down") {
  await requireAdmin();
  const res = resources[resourceKey];
  if (!res?.orderField) return;
  const model = delegate(res.model);
  const rows: { id: string }[] = await model.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const i = rows.findIndex((r) => r.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await db.$transaction(rows.map((r, idx) => model.update({ where: { id: r.id }, data: { sortOrder: idx } })));
  refresh();
}

export async function toggleAction(resourceKey: string, id: string) {
  await requireAdmin();
  const res = resources[resourceKey];
  if (!res?.publishField) return;
  const model = delegate(res.model);
  const row = await model.findUnique({ where: { id } });
  if (!row) return;
  await model.update({ where: { id }, data: { [res.publishField]: !row[res.publishField] } });
  refresh();
}

/* --------------------------- Inquiries --------------------------- */

export async function setInquiryStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED"]).safeParse(status);
  if (!parsed.success) return;
  await db.contactInquiry.update({ where: { id }, data: { status: parsed.data } });
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await db.contactInquiry.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/inquiries");
}
