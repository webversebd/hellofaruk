import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteInquiry, setInquiryStatus } from "../../../actions";

const STATUSES = [["NEW", "New"], ["CONTACTED", "Contacted"], ["IN_PROGRESS", "In progress"], ["COMPLETED", "Completed"]] as const;

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const r = await db.contactInquiry.findUnique({ where: { id } });
  if (!r) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/inquiries" className="text-sm text-muted hover:text-ink">← All inquiries</Link>
      <div className="rounded-2xl border border-line bg-white p-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold">{r.name}</h1>
          <p className="text-sm text-muted">{r.createdAt.toLocaleString("en-GB")}</p>
        </div>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt className="text-muted">Email</dt><dd><a className="underline" href={`mailto:${r.email}`}>{r.email}</a></dd>
          <dt className="text-muted">Phone</dt><dd>{r.phone ? <a className="underline" href={`tel:${r.phone}`}>{r.phone}</a> : "—"}</dd>
          <dt className="text-muted">Project type</dt><dd>{r.projectType ?? "—"}</dd>
          <dt className="text-muted">Budget</dt><dd>{r.budget ?? "—"}</dd>
        </dl>
        <p className="whitespace-pre-wrap rounded-xl bg-bg p-4 text-sm leading-relaxed">{r.message}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map(([v, l]) => (
          <form key={v} action={setInquiryStatus.bind(null, r.id, v)}>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold border ${r.status === v ? "bg-ink text-white border-ink" : "border-line bg-white hover:border-ink"}`}>{l}</button>
          </form>
        ))}
        <div className="ml-auto">
          <ConfirmButton action={deleteInquiry.bind(null, r.id)} message="Delete this inquiry permanently?" className="rounded-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</ConfirmButton>
        </div>
      </div>
    </div>
  );
}
