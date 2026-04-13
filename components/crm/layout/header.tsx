"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Settings } from "lucide-react";
import { useI18nStore } from "@/store/use-i18n-store";

export function Header() {
  const { t, language, setLanguage } = useI18nStore();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex justify-between items-center px-6 h-16 bg-[#faf6f0] dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-8 md:pl-64">
        <span className="text-xl font-bold font-serif text-[#4a7c59] dark:text-emerald-500 md:hidden">UNO CRM</span>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors px-3 py-1 rounded-lg">
              {t("sidebar.dashboard")}
            </Link>
            <Link href="/leads" className="text-[#4a7c59] dark:text-emerald-400 font-bold transition-opacity">
              {t("sidebar.leads")}
            </Link>
            <Link href="/contacts" className="text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors px-3 py-1 rounded-lg">
              {t("sidebar.contacts")}
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center border border-stone-200 dark:border-stone-800 dark:bg-stone-800 rounded-lg p-0.5 text-[10px] font-bold">
          <button onClick={() => setLanguage('ru')} className={`px-2 py-1 rounded ${language === 'ru' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>RU</button>
          <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>EN</button>
          <button onClick={() => setLanguage('uz')} className={`px-2 py-1 rounded ${language === 'uz' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>UZ</button>
        </div>

        <div className="relative hidden lg:block text-stone-500">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input 
            className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#4a7c59] outline-none w-64" 
            placeholder={t("header.searchPlaceholder")} 
            type="text" 
          />
        </div>
        
        <button className="p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <Image 
           alt="User profile"
           width={32}
           height={32}
           unoptimized
           className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 object-cover" 
           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAW9N09bQKDICp9YXlyOxDxEmdEQoKJ_0fz7a3ZLY2FfQcifNeUNOI_8ZcG-mpNod8_RLX_m9XUYv4KuEpQ0WMIDq8zD-fgguR-itcnuwt9DG2Oni_D0mr49zj2hHL9u-gUFEqJy5AH1LVNgNj6Pp2YcwA4-ycGVWaefdq_f-bbiEEihLchLn_PAxfcA1iu9Ezys1Fj6W-lEnRNueZeG73bejWr10XAf35OYfmQXafJG2OsiQ72e8HLA05jjnaRe955ak8lsWZoQ"
        />
      </div>
    </header>
  );
}
