import { notFound } from "next/navigation";
import { resources } from "@/lib/admin-config";
import { getOptions } from "@/lib/admin-options";
import { ResourceForm } from "@/components/admin/ResourceForm";

export default async function NewPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: key } = await params;
  const res = resources[key];
  if (!res?.canCreate) notFound();
  const options = await getOptions(key);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add {res.singular.toLowerCase()}</h1>
      <ResourceForm resource={res} row={null} id={null} options={options} />
    </div>
  );
}
