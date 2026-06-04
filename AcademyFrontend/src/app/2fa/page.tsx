"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { ShieldCheck, Loader2, ArrowRight, ShieldAlert, LogOut, Copy } from "lucide-react";

interface AuthContextType {
  user: any;
  loading: boolean;
  checkAuth: () => Promise<void>;
  setTwoFactorVerified: (val: boolean) => void;
  logout: () => void;
}

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, checkAuth, setTwoFactorVerified, logout } = useAuth() as AuthContextType;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // OTP State (6 boxes)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSetup = !user?.otp_enabled;

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

    if (user.is_superuser || user.is_staff) {
      router.replace("/admin/dashboard");
      return;
    }

    if (isSetup && !qrCode) {
      fetchApi("/api/private/users/2fa/enable/", { method: "POST" })
        .then((data: any) => {
          setQrCode(data.qr_code);
          setSecretKey(data.secret);
        })
        .catch(() => setError("Impossible de générer le code QR."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading, router, isSetup, qrCode]);

  // Focus le premier input au chargement
  useEffect(() => {
    if (!loading && !authLoading) {
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [loading, authLoading]);

  // Auto-submit si 6 chiffres
  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6 && !submitting) {
      handleVerify(undefined, code);
    }
  }, [otp]);

  // OTP Logic
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; // Seulement des chiffres

    const newOtp = [...otp];
    // On ne prend que le dernier caractère saisi pour gérer les frappes multiples rapides
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Focus sur le champ suivant
    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Si on appuie sur backspace sur un champ vide, on recule et on vide
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    // Auto-focus sur le dernier champ rempli ou le suivant
    const nextFocusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();

    const finalCode = directCode || otp.join("");
    if (finalCode.length !== 6) return;

    setSubmitting(true);
    setError(null);

    try {
      await fetchApi("/api/private/users/2fa/verify/", {
        method: "POST",
        body: JSON.stringify({ otp_token: finalCode }),
      });

      setTwoFactorVerified(true);
      await checkAuth();
      const freshUser = await fetchApi("/api/private/users/me/");
      redirectUser(freshUser);
    } catch (err: any) {
      setError("Le code est incorrect ou a expiré.");
      setOtp(Array(6).fill("")); // Reset
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin mb-4" />
        <p className="text-xs font-medium text-slate-500">Préparation de la sécurité...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">

          <div className="flex justify-between items-start mb-8">
            <div className={"w-12 h-12 rounded-lg flex items-center justify-center border ${isSetup ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-900'}"}>
              {isSetup ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
            </div>
            <button onClick={() => logout()} className="text-slate-400 hover:text-rose-600 transition-colors p-2" title="Déconnexion">
              <LogOut size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {isSetup ? "Sécurisez votre compte" : "Vérification 2FA"}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isSetup
                ? "Scannez le QR Code avec l'application Authenticator"
                : "Entrez le code à 6 chiffres généré par votre application d'authentification."}
            </p>
          </div>

          {isSetup && qrCode && secretKey && (
            <div className="flex flex-col items-center mb-8 border-b border-slate-100 pb-8">
              <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 shadow-sm">
                <Image
                  src={"data:image/svg+xml;base64,${qrCode}"}
                  alt="QR Code"
                  width={160}
                  height={160}
                  unoptimized
                />
              </div>

              <div className="w-full text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  Impossible de scanner ? Saisissez cette clé :
                </p>
                <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md">
                  <span className="text-sm text-slate-900 font-mono tracking-widest break-all font-semibold">
                    {secretKey.match(/.{1,4}/g)?.join(' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(secretKey)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex-shrink-0"
                    title="Copier la clé"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input key={index} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 h-14 md:w-14 md:h-16 bg-white border border-slate-300 rounded-lg text-center text-2xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={otp.join("").length !== 6 || submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSetup ? "Activer le 2FA" : "Vérifier le code"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Un problème de connexion ? <a href="#" className="font-medium text-slate-600 hover:text-slate-900 hover:underline">Contactez le support</a>
          </p>
        </div>
      </div>
    </div>
  );
}