import { use } from 'react';
import { OrganizationDetail } from '@/features/organizations/components/OrganizationDetail';

export default function OrganizationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    return <OrganizationDetail id={id} />;
}