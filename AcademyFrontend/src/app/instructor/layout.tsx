import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import TopBar from "@/components/navigation/TopBar";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#090C14] overflow-hidden text-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <TopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
