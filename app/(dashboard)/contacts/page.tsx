"use client";

import { useI18nStore } from "@/store/use-i18n-store";
import { Search, UserPlus, Filter, MoreHorizontal } from "lucide-react";

const contacts = [
  { name: "Алексей Иванов", company: "AI Solutions", email: "alex@example.com", phone: "+7 900 123-4567", status: "Active" },
  { name: "Мария Петрова", company: "Freelance", email: "maria@example.com", phone: "+7 900 765-4321", status: "Lead" },
  { name: "ТехноСфера", company: "TechSphere LLC", email: "info@techsphere.com", phone: "+7 999 000-0001", status: "Partner" },
];

export default function ContactsPage() {
  const { t } = useI18nStore();

  return (
    <main className="md:pl-64 pt-16 min-h-screen p-8 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 dark:text-stone-50">{t("sidebar.contacts")}</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your customer relationships and contact details.</p>
          </div>
          <button className="bg-[#4a7c59] text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#4a7c59]/20">
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        </header>

        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-950/20">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none w-64"
              />
            </div>
            <button className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-xs text-stone-400 font-bold uppercase tracking-widest bg-stone-50/30 dark:bg-stone-950/20">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {contacts.map((contact, i) => (
                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">{contact.name}</td>
                  <td className="px-6 py-4 text-stone-500">{contact.company}</td>
                  <td className="px-6 py-4 text-stone-500">{contact.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold uppercase tracking-tighter">
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-300">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
