import Link from "next/link";
import type { InquiryStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const STATUS_LABEL: Record<InquiryStatus, string> = { NEW: "New", CONTACTED: "Contacted", IN_PROGRESS: "In progress", COMPLETED: "Completed" };

export default async function Inquiries({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const where: Prisma.ContactInquiryWhereInput = {};
  if (status && status in STATUS_LABEL) where.status = status as InquiryStatus;
  if (q) where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { email: { contains: q, mode: "insensitive" } },
    { message: { contains: q, mode: "insensitive" } },
  ];
  const rows = await db.contactInquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inquiries</h1>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search name, email, message…" className="input max-w-xs" />
        <select name="status" defaultValue={status ?? ""} className="input max-w-[11rem]">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className="btn btn-line">Filter</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="text-left text-muted border-b border-line">
            <tr><th className="px-4 py-3 font-medium">From</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Received</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No inquiries found.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-bg">
                <td className="px-4 py-3"><Link href={`/admin/inquiries/${r.id}`} className="font-medium hover:text-accent">{r.name}</Link><div className="text-xs text-muted">{r.email}</div></td>
                <td className="px-4 py-3">{r.projectType ?? "—"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-bg border border-line px-3 py-1 text-xs font-semibold">{STATUS_LABEL[r.status]}</span></td>
                <td className="px-4 py-3 text-muted">{r.createdAt.toLocaleString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
