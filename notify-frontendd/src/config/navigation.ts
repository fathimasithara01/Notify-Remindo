import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Bell,
  Users,
  Mail,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
  { href: ROUTES.organizations.list, label: 'Organizations', icon: Building2, permission: 'organization.view' },
  { href: ROUTES.roles.list, label: 'Roles', icon: ShieldCheck, permission: 'role.view' },
  { href: ROUTES.permissions, label: 'Permissions', icon: KeyRound, permission: 'permission.view' },
  { href: ROUTES.subscriptions.plans, label: 'Subscription Plans', icon: CreditCard, permission: 'plan.view' },
  { href: ROUTES.subscriptions.features, label: 'Features', icon: CreditCard, permission: 'plan.view' },
  { href: ROUTES.subscriptions.planFeatures, label: 'Plan Features', icon: CreditCard, permission: 'plan.view' },
  {
    href: ROUTES.subscriptions.organizationSubscriptions,
    label: 'Organization Subscriptions',
    icon: CreditCard,
    permission: 'subscription.view',
  },
  { href: ROUTES.notifications, label: 'Notifications', icon: Bell, permission: 'notification.view' },
  { href: ROUTES.users.list, label: 'Admin Users', icon: Users, permission: 'user.view' },
  { href: ROUTES.invites, label: 'Invites', icon: Mail, permission: 'organization.view' },
  { href: ROUTES.audit, label: 'Audit Log', icon: ScrollText, permission: 'auditlog.view' },
];