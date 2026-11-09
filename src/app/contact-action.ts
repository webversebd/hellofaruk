"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(30).regex(/^[\d\s+().-]*$/, "Enter a valid phone number").optional().or(z.literal("")),
  projectType: z.string().trim().max(100).optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please add a few more details").max(4000),
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function submitInquiry(_: ContactState, fd: FormData): Promise<ContactState> {
  // Spam: honeypot + minimum fill time (silently accept so bots learn nothing)
  const started = Number(fd.get("t"));
  if (String(fd.get("website") ?? "") !== "" || !started || Date.now() - started < 2500) return { ok: true };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) return { error: "Too many messages from your connection. Please try again later." };

  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = String(fd.get("cf-turnstile-response") ?? "");
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    }).then((x) => x.json()).catch(() => ({ success: false }));
    if (!r.success) return { error: "Spam check failed. Please try again." };
  }

  const parsed = schema.safeParse({
    name: fd.get("name") ?? "", email: fd.get("email") ?? "", phone: fd.get("phone") ?? "",
    projectType: fd.get("projectType") ?? "", budget: fd.get("budget") ?? "", message: fd.get("message") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    return { error: "Please check the highlighted fields.", fieldErrors };
  }
  const d = parsed.data;

  try {
    await db.contactInquiry.create({
      data: {
        name: d.name, email: d.email, phone: d.phone || null, projectType: d.projectType || null, budget: d.budget || null, message: d.message,
        ipHash: createHash("sha256").update(ip + (process.env.AUTH_SECRET ?? "")).digest("hex").slice(0, 32),
      },
    });
  } catch (e) {
    console.error("inquiry save failed", e);
    return { error: "Something went wrong. Please try WhatsApp or email instead." };
  }

  // Email is best-effort: the inquiry is already stored and visible in the admin.
  try {
    const settings = await db.websiteSettings.findFirst({ select: { email: true } });
    const to = settings?.email;
    if (process.env.RESEND_API_KEY && to) {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.RESEND_FROM ?? "Website <onboarding@resend.dev>",
        to,
        replyTo: d.email,
        subject: `New inquiry from ${d.name}`,
        html: `<h2>New website inquiry</h2><p><b>Name:</b> ${esc(d.name)}<br><b>Email:</b> ${esc(d.email)}<br><b>Phone:</b> ${esc(d.phone || "-")}<br><b>Project:</b> ${esc(d.projectType || "-")}<br><b>Budget:</b> ${esc(d.budget || "-")}</p><p style="white-space:pre-wrap">${esc(d.message)}</p>`,
      });
    }
  } catch (e) {
    console.error("resend failed", e);
  }

  return { ok: true };
}
