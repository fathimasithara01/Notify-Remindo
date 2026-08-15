import { OrganizationEditForm } from "@/features/organizations/components/OrganizationEditForm";

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">      
      <OrganizationEditForm id={id} />
    </div>
  );
}