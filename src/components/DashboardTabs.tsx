"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BarChart3, CreditCard, Settings } from "lucide-react";
import type { AppDict } from "@/lib/i18n/app";

export function DashboardTabs({ nav }: { nav: AppDict["nav"] }) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/dashboard",
      label: nav.chatbots,
      icon: MessageSquare,
      active: pathname === "/dashboard" || pathname.startsWith("/dashboard/chatbots"),
    },
    {
      href: "/dashboard/analytics",
      label: nav.analytics,
      icon: BarChart3,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/billing",
      label: nav.billing,
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/billing"),
    },
    {
      href: "/dashboard/settings",
      label: nav.settings,
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition " +
                (t.active
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800")
              }
            >
              <Icon size={16} />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
