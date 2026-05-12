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
        <main className="flex-1 overflow-y-auto bg-[#090C14] text-white custom-scrollbar relative">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
