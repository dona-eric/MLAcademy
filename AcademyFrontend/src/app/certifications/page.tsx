"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CertificationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/certifications");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090C14]">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
    </div>
  );
}
