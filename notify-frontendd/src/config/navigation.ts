import {
  LayoutDashboard,
  Building2,
  UsersRound,
  CreditCard,
  Receipt,
  Briefcase,
  BarChart3,
  FileBarChart,
  Bell,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type SidebarLeafItem = {
  label: string;
  to: string;
  badge?: string;
};

export type SidebarGroupItem = {
  label: string;
  icon: LucideIcon;
  to?: string;
  badge?: string;
  children?: SidebarLeafItem[];
};

export type SidebarSection = {
  heading?: string;
  items: SidebarGroupItem[];
};

export const PLATFORM_NAVIGATION: SidebarSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        to: "/platform/dashboard",
      },
    ],
  },

  {
    heading: "Customer Management",
    items: [
      {
        label: "Organizations",
        icon: Building2,
        children: [
          {
            label: "All Organizations",
            to: "/platform/organizations",
          },
          {
            label: "Active Customers",
            to: "/platform/organizations/active",
            badge: "1,284",
          },
          {
            label: "Trial Customers",
            to: "/platform/organizations/trial",
            badge: "42",
          },
          {
            label: "Blocked Customers",
            to: "/platform/organizations/blocked",
          },
        ],
      },
      {
        label: "Users & Roles",
        icon: UsersRound,
        children: [
          {
            label: "Users",
            to: "/platform/users",
          },
          {
            label: "Roles",
            to: "/platform/roles",
          },
          {
            label: "Permissions",
            to: "/platform/permissions",
          },
        ],
      },
    ],
  },

  {
    heading: "Revenue & Plans",
    items: [
      {
        label: "Subscriptions",
        icon: CreditCard,
        children: [
          {
            label: "Plans",
            to: "/platform/subscriptions/plans",
          },
          {
            label: "Features",
            to: "/platform/subscriptions/features",
          },
          {
            label: "Plan History",
            to: "/platform/subscriptions/history",
          },
        ],
      },
      {
        label: "Billing",
        icon: Receipt,
        badge: "3",
        children: [
          {
            label: "Invoices",
            to: "/platform/billing/invoices",
          },
          {
            label: "Payments",
            to: "/platform/billing/payments",
          },
          {
            label: "Transactions",
            to: "/platform/billing/transactions",
          },
        ],
      },
    ],
  },

  {
    heading: "Sales Operations",
    items: [
      {
        label: "Sales",
        icon: Briefcase,
        children: [
          {
            label: "Salesmen",
            to: "/platform/sales/salesmen",
          },
          {
            label: "Commissions",
            to: "/platform/sales/commissions",
          },
          {
            label: "Settlements",
            to: "/platform/sales/settlements",
          },
        ],
      },
    ],
  },

  {
    heading: "Insights",
    items: [
      {
        label: "Analytics",
        icon: BarChart3,
        children: [
          {
            label: "Customer Growth",
            to: "/platform/analytics/growth",
          },
          {
            label: "Revenue Analytics",
            to: "/platform/analytics/revenue",
          },
          {
            label: "Usage Analytics",
            to: "/platform/analytics/usage",
          },
        ],
      },
      {
        label: "Reports",
        icon: FileBarChart,
        children: [
          {
            label: "Revenue Reports",
            to: "/platform/reports/revenue",
          },
          {
            label: "Customer Reports",
            to: "/platform/reports/customers",
          },
          {
            label: "Sales Reports",
            to: "/platform/reports/sales",
          },
          {
            label: "Export Center",
            to: "/platform/reports/export",
          },
        ],
      },
    ],
  },

  {
    heading: "System",
    items: [
      {
        label: "Notifications",
        icon: Bell,
        badge: "12",
        children: [
          {
            label: "Notification Queue",
            to: "/platform/notifications/queue",
          },
          {
            label: "Delivery Logs",
            to: "/platform/notifications/logs",
          },
          {
            label: "Failed Notifications",
            to: "/platform/notifications/failed",
            badge: "5",
          },
        ],
      },
      {
        label: "Settings",
        icon: Settings,
        children: [
          {
            label: "General Settings",
            to: "/platform/settings/general",
          },
          {
            label: "Email Configuration",
            to: "/platform/settings/email",
          },
          {
            label: "WhatsApp Configuration",
            to: "/platform/settings/whatsapp",
          },
          {
            label: "Security Settings",
            to: "/platform/settings/security",
          },
        ],
      },
      {
        label: "Audit Logs",
        icon: ShieldCheck,
        to: "/platform/audit",
      },
    ],
  },
];