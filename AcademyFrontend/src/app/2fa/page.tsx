"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { ShieldCheck, Loader2, ArrowRight, ShieldAlert, KeyRound, LogOut } from "lucide-react";

// Idéalement, déplace cette interface dans un fichier types
interface AuthContextType {
  user: any;
  authLoading: boolean;
  checkAuth: () => Promise<void>;
  setTwoFactorVerified: (val: boolean) => void;
  logout: () => void;
}

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const { user, authLoading, checkAuth, setTwoFactorVerified, logout } = useAuth() as AuthContextType;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isSetup = !user?.otp_enabled;

  // Memoize redirection logic
  const redirectUser = useCallback((userData: any) => {
    if (userData?.is_instructor) return router.push("/instructor");
    if (userData?.student_profile?.onboarding_completed) return router.push("/dashboard");
    router.push("/onboarding");
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    // Skip if already a staff member with special access
    if (user.is_superuser || user.is_staff) {
      router.replace("/admin/dashboard");
      return;
    }

    if (isSetup && !qrCode) {
      fetchApi("/api/private/users/2fa/enable/", { method: "POST" })
        .then((data) => {
          setQrCode(data.qr_code);
        })
        .catch(() => setError("Impossible de générer le code QR."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading, router, isSetup, qrCode]);

  // Auto-submit when 6 digits are reached
  useEffect(() => {
    if (otpCode.length === 6 && !submitting) {
      handleVerify();
    }
  }, [otpCode]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) return;

    setSubmitting(true);
    setError(null);

    try {
      await fetchApi("/api/private/users/2fa/verify/", {
        method: "POST",
        body: JSON.stringify({ otp_token: otpCode }),
      });

      setTwoFactorVerified(true);
      await checkAuth();
      redirectUser(user);
    } catch (err: any) {
      setError("Le code est incorrect ou expiré.");
      setOtpCode(""); // Reset pour permettre de retaper
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card p-8 rounded-[32px] border border-white/10 shadow-2xl relative">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isSetup ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              {isSetup ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
            </div>
            <button
              onClick={() => logout()}
              className="text-slate-500 hover:text-white transition-colors p-2"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isSetup ? "Sécurisez votre compte" : "Vérification 2FA"}
            </h1>
            <p className="text-slate-400 text-sm">
              {isSetup
                ? "Scannez le QR Code pour lier votre application (Google Authenticator, Authy...)"
                : "Entrez le code généré par votre application."}
            </p>
          </div>

          {isSetup && qrCode && (
            <div className="flex flex-col items-center mb-8">
              <div className="bg-white p-3 rounded-2xl mb-2">
                <Image src={`data:image/svg+xml;base64,${qrCode}`} alt="QR Code" width={180} height={180} unoptimized />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">SECRET_KEY_BACKUP_HERE</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000 000"
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl tracking-[0.3em] text-white text-center font-mono focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                <p className="text-xs font-semibold text-rose-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || otpCode.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vérifier"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}