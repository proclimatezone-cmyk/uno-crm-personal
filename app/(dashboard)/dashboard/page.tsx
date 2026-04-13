"use client";

import { LayoutDashboard, TrendingUp, Users, DollarSign } from "lucide-react";
import { useI18nStore } from "@/store/use-i18n-store";

const stats = [
  { label: "Total Revenue", value: "$45,231", change: "+12.5%", icon: DollarSign, color: "bg-emerald-100 text-emerald-700" },
  { label: "Active Leads", value: "84", change: "+3.2%", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
  { label: "New Contacts", value: "12", change: "-2.1%", icon: Users, color: "bg-amber-100 text-amber-700" },
  { label: "Conversion Rate", value: "24.5%", change: "+4.8%", icon: LayoutDashboard, color: "bg-purple-100 text-purple-700" },
];

export default function DashboardPage() {
  const { t } = useI18nStore();

  return (
    <main className="md:pl-64 pt-16 min-h-screen p-8 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-serif text-stone-900 dark:text-stone-50">{t("sidebar.dashboard")}</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">System Overview & Performance Metrics</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-8 h-96 flex items-center justify-center text-stone-400 italic">
          Analytics chart visualization placeholder...
        </div>
      </div>
    </main>
  );
}
