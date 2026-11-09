import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { resources } from "@/lib/admin-config";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteAction, moveAction, toggleAction } from "../../actions";

type Row = Record<string, unknown> & { id: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delegate = (m: string): any => (db as any)[m];

export default async function ResourcePage({ params, searchParams }: { params: Promise<{ resource: string }>; searchParams: Promise<{ q?: string }> }) {
  const { resource: key } = await params;
  const res = resources[key];
  if (!res) notFound();

  if (res.singleton) {
    const row = (await delegate(res.model).findFirst()) as Row | null;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{res.label}</h1>
          {res.description && <p className="text-sm text-muted mt-1">{res.description}</p>}
        </div>
        <ResourceForm resource={res} row={row} id={null} />
      </div>
    );
  }

  const { q } = await searchParams;
  const all = (await delegate(res.model).findMany({
    orderBy: res.orderField ? [{ sortOrder: "asc" }, { createdAt: "asc" }] : { createdAt: "desc" },
  })) as Row[];
  const rows = q ? all.filter((r) => String(r[res.titleField] ?? "").toLowerCase().includes(q.toLowerCase())) : all;
  const pub = res.publishField;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{res.label}</h1>
          {res.description && <p className="text-sm text-muted mt-1">{res.description}</p>}
        </div>
        {res.canCreate && <Link href={`/admin/${res.key}/new`} className="btn btn-dark">Add {res.singular.toLowerCase()}</Link>}
      </div>

      <form className="max-w-sm">
        <input name="q" defaultValue={q} placeholder={`Search ${res.label.toLowerCase()}…`} className="input" />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="text-left text-muted border-b border-line">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              {pub && <th className="px-4 py-3 font-medium">Status</th>}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Nothing here yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium">{String(r[res.titleField] ?? "—")}</td>
                {pub && (
                  <td className="px-4 py-3">
                    <form action={toggleAction.bind(null, res.key, r.id)}>
                      <button className={`rounded-full px-3 py-1 text-xs font-semibold ${r[pub] ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"}`}>
                        {r[pub] ? "Live" : "Hidden"}
                      </button>
                    </form>
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {res.orderField && !q && (
                      <>
                        <form action={moveAction.bind(null, res.key, r.id, "up")}><button aria-label="Move up" className="px-2 py-1 rounded hover:bg-bg">↑</button></form>
                        <form action={moveAction.bind(null, res.key, r.id, "down")}><button aria-label="Move down" className="px-2 py-1 rounded hover:bg-bg">↓</button></form>
                      </>
                    )}
                    <Link href={`/admin/${res.key}/${r.id}`} className="px-3 py-1 rounded-full border border-line hover:border-ink">Edit</Link>
                    {res.canDelete && (
                      <ConfirmButton action={deleteAction.bind(null, res.key, r.id)} message={`Delete this ${res.singular.toLowerCase()}? This cannot be undone.`} className="px-3 py-1 rounded-full text-red-600 hover:bg-red-50">
                        Delete
                      </ConfirmButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
