import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  CreditCard,
  Bell,
  Users,
  Mail,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';
import { PERMISSIONS, type Permission } from '@/config/permissions';


export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
  { href: ROUTES.organizations.list, label: 'Organizations', icon: Building2, permission: PERMISSIONS.ORG_VIEW },
  { href: ROUTES.roles.list, label: 'Roles', icon: ShieldCheck, permission: PERMISSIONS.ROLE_VIEW },
  { href: ROUTES.subscriptions.plans, label: 'Subscription Plans', icon: CreditCard, permission: PERMISSIONS.PLAN_VIEW },
  { href: ROUTES.subscriptions.features, label: 'Features', icon: CreditCard, permission: PERMISSIONS.PLAN_VIEW },
  { href: ROUTES.notifications, label: 'Notifications', icon: Bell, permission: PERMISSIONS.NOTIFICATION_VIEW },
  { href: ROUTES.users.list, label: 'Admin Users', icon: Users, permission: PERMISSIONS.USER_VIEW },
  { href: ROUTES.invites, label: 'Invites', icon: Mail, permission: PERMISSIONS.ORG_VIEW },
  { href: ROUTES.audit, label: 'Audit Log', icon: ScrollText, permission: PERMISSIONS.AUDITLOG_VIEW },
];