import { OrganizationForm } from '@/features/organizations/components/OrganizationForm';

export default function NewOrganizationPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Organization</h1>
        <p className="text-sm text-muted-foreground">Onboard a new subscribing organization.</p>
      </div>

      <OrganizationForm />
    </div>
  );
}