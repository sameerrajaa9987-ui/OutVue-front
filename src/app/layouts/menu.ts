import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  BarChart3,
  Brain,
  CreditCard,
  FileText,
  ShieldCheck,
  Settings,
  ClipboardList,
  CalendarDays,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/modules/auth/types";

export type MenuItem = {
  label: string;
  to?: string;
  icon?: LucideIcon;
  roles?: Role[];
  children?: MenuItem[];
};

export const MENU: MenuItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Growth Data",
    icon: TrendingUp,
    children: [
      { label: "Marketing Spend", to: "/data/marketing" },
      { label: "BD Activity", to: "/data/bd" },
      { label: "Operational Costs", to: "/data/operational" },
      { label: "Revenue & Conversions", to: "/data/revenue" },
      { label: "Ecosystem Tracking", to: "/ecosystem" },
    ],
  },
  {
    label: "Ad Accounts",
    to: "/accounts",
    icon: Megaphone,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    children: [
      { label: "Trends", to: "/analytics/trends" },
      { label: "Comparison", to: "/analytics/compare" },
      { label: "Budget Allocation", to: "/budget" },
    ],
  },
  {
    label: "AI Insights",
    to: "/insights",
    icon: Brain,
  },
  {
    label: "Action Planning",
    to: "/actions",
    icon: ClipboardList,
  },
  {
    label: "Monthly Review",
    to: "/review",
    icon: CalendarDays,
  },
  {
    label: "Scenario Modelling",
    to: "/scenarios",
    icon: Sparkles,
  },
  {
    label: "Billing",
    to: "/billing",
    icon: CreditCard,
  },
  {
    label: "Reports",
    to: "/reports",
    icon: FileText,
  },
  {
    label: "Admin",
    icon: ShieldCheck,
    roles: ["Admin"],
    children: [
      { label: "Users", to: "/admin/users" },
      { label: "Revenue", to: "/admin/revenue" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Business Profile", to: "/settings/profile" },
      { label: "Account", to: "/settings/account" },
    ],
  },
];
