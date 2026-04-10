"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, Users, BarChart3, PlusCircle, Leaf } from "lucide-react";
import { useI18nStore } from "@/store/use-i18n-store";

export function Sidebar() {
  const pathname = usePathname() || "";
  const { t } = useI18nStore();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "sidebar.dashboard" },
    { href: "/leads", icon: KanbanSquare, label: "sidebar.leads" },
    { href: "/contacts", icon: Users, label: "sidebar.contacts" },
    { href: "/analytics", icon: BarChart3, label: "sidebar.analytics" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex-col py-6 w-64 z-50 bg-[#faf6f0] dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 hidden md:flex">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[#4a7c59] dark:text-emerald-500 leading-none">UNO</h2>
            <p className="text-xs text-stone-500 font-sans uppercase tracking-widest mt-1">Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-150 ${
                isActive 
                  ? "bg-[#4a7c59] text-white scale-[0.98]" 
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{t(item.label)}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="px-6 mt-auto">
        <button className="w-full bg-[#4a7c59] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#4a7c59]/20 hover:opacity-90 transition-opacity">
          <PlusCircle className="w-5 h-5" />
          {t("sidebar.newLead")}
        </button>
      </div>
    </aside>
  );
}
