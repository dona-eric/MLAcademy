"use client";

import React from "react";
import { FaLinkedin } from "react-icons/fa6";

interface LinkedInAddButtonProps {
  courseTitle: string;
  certificateId: string;
  issueDate?: string; // Format ISO ou YYYY-MM-DD
}

export const LinkedInAddButton: React.FC<LinkedInAddButtonProps> = ({
  courseTitle,
  certificateId,
  issueDate,
}) => {
  let year = "2026";
  let month = "08";

  if (issueDate) {
    const d = new Date(issueDate);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear().toString();
      month = (d.getMonth() + 1).toString().padStart(2, "0");
    }
  }

  const frontendUrl =
    typeof window !== "undefined" ? window.location.origin : "https://mlacademie.vercel.app";

  const linkedInUrl = new URL("https://www.linkedin.com/profile/add");
  linkedInUrl.searchParams.append("startTask", "CERTIFICATION_NAME");
  linkedInUrl.searchParams.append("name", `Certification MLAcademy: ${courseTitle}`);
  linkedInUrl.searchParams.append("organizationName", "MLAcademy");
  linkedInUrl.searchParams.append("issueYear", year);
  linkedInUrl.searchParams.append("issueMonth", month);
  linkedInUrl.searchParams.append("certUrl", `${frontendUrl}/verify/${certificateId}`);
  linkedInUrl.searchParams.append("certId", certificateId);

  return (
    <a
      href={linkedInUrl.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2.5 bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
    >
      <FaLinkedin className="w-4 h-4 text-white shrink-0" />
      <span>Ajouter à mon profil LinkedIn</span>
    </a>
  );
};
