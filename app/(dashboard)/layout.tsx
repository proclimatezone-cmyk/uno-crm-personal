import { Sidebar } from "@/components/crm/layout/sidebar";
import { Header } from "@/components/crm/layout/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100">
      <Sidebar />
      <Header />
      {children}
    </div>
  );
}
