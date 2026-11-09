import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { resources } from "@/lib/admin-config";
import { getOptions } from "@/lib/admin-options";
import { ResourceForm } from "@/components/admin/ResourceForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delegate = (m: string): any => (db as any)[m];

export default async function EditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: key, id } = await params;
  const res = resources[key];
  if (!res || res.singleton) notFound();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const row = await delegate(res.model).findUnique({ where: { id } });
  if (!row) notFound();
  const options = await getOptions(key);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit {res.singular.toLowerCase()}</h1>
      <ResourceForm resource={res} row={row} id={id} options={options} />
    </div>
  );
}
