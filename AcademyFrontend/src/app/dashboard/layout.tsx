import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import TopBar from "@/components/navigation/TopBar";
import BottomNav from "@/components/navigation/BottomNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar />
<<<<<<< HEAD
        <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 custom-scrollbar relative">
=======
        <main className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] text-[var(--text-primary)] custom-scrollbar relative">
>>>>>>> develop
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
