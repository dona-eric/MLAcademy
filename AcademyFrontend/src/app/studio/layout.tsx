import { ReactNode } from "react";
import StudioSidebar from "@/components/navigation/StudioSidebar";
import StudioHeader from "@/components/navigation/StudioHeader";
import StudioBanner from "@/components/navigation/StudioBanner";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#090C14] overflow-hidden text-white font-sans">
      <StudioSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <StudioBanner />
        <StudioHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
