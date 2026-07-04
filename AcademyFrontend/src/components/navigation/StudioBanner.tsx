"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function StudioBanner() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  if (!user.otp_enabled) {
    return (
      <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 z-50">
        <AlertTriangle className="w-4 h-4" />
        <span>
          Sécurité : L'authentification à deux facteurs (2FA) n'est pas activée sur votre compte.
        </span>
        <Link href="/settings" className="underline hover:text-amber-100 transition-colors ml-2">
          Activer maintenant
        </Link>
      </div>
    );
  }

  return null;
}
