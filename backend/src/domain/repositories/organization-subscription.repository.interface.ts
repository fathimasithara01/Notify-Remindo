import {
    OrganizationSubscription,
    CreateOrganizationSubscriptionInput,
    OrganizationSubscriptionStatus,
} from "../entities/organization-subscription.entity";

export interface OrganizationSubscriptionListFilters {
    organizationId: string;
    status?: OrganizationSubscriptionStatus;
    page?: number;
    limit?: number;
}

export interface OrganizationSubscriptionListResult {
    items: OrganizationSubscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IOrganizationSubscriptionRepository {
    create(data: CreateOrganizationSubscriptionInput): Promise<OrganizationSubscription>; //  Create new organization subscription
    findById(id: string): Promise<OrganizationSubscription | null>;
    findActiveSubscription(organizationId: string): Promise<OrganizationSubscription | null>;
    listHistory(filters: OrganizationSubscriptionListFilters): Promise<OrganizationSubscriptionListResult>;
    updateStatus(id: string, data: { status: OrganizationSubscriptionStatus; cancelledAt?: Date | null; }): Promise<OrganizationSubscription | null>;
    cancel(id: string, cancelledAt: Date): Promise<OrganizationSubscription | null>;
    renew(id: string, data: {
        startDate: Date;
        endDate: Date;
    }): Promise<OrganizationSubscription | null>;

}