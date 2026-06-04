import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import TopBar from "@/components/navigation/TopBar";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
