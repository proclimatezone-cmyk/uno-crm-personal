"use client";

import { useI18nStore } from "@/store/use-i18n-store";
import { BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const { t } = useI18nStore();

  return (
    <main className="md:pl-64 pt-16 min-h-screen p-8 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 dark:text-stone-50">{t("sidebar.analytics")}</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Deep insights into your sales performance and pipeline velocity.</p>
          </div>
          <div className="flex bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1">
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-emerald-700 text-white rounded-md flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              This Month
            </button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
              Last Quarter
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-8 shadow-sm h-80 flex flex-col">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif text-lg mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Sales Growth
            </div>
            <div className="flex-1 flex items-center justify-center text-stone-400 italic text-sm">
              [Bar Chart Visualization Placeholder]
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-8 shadow-sm h-80 flex flex-col">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif text-lg mb-6">
              <PieChart className="w-5 h-5 text-blue-600" />
              Lead Sources
            </div>
            <div className="flex-1 flex items-center justify-center text-stone-400 italic text-sm">
              [Pie Chart Visualization Placeholder]
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-8 shadow-sm h-96 flex flex-col">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif text-lg mb-6">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            Conversion Pipeline Velocity
          </div>
          <div className="flex-1 flex items-center justify-center text-stone-400 italic text-sm">
            [Large Area Chart Visualization Placeholder]
          </div>
        </div>
      </div>
    </main>
  );
}
