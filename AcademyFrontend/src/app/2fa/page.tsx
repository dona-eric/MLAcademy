"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
<<<<<<< HEAD
import { ShieldCheck, Loader2, ArrowRight, ShieldAlert, LogOut, Copy } from "lucide-react";

interface AuthContextType {
  user: any;
  loading: boolean;
  checkAuth: () => Promise<void>;
=======
import { ShieldCheck, Loader2, ArrowRight, ShieldAlert, LogOut, Copy, RefreshCw } from "lucide-react";
import type { UserProfile } from "@/types/user";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  checkAuth: () => Promise<UserProfile | null>;
>>>>>>> develop
  setTwoFactorVerified: (val: boolean) => void;
  logout: () => void;
}

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, checkAuth, setTwoFactorVerified, logout } = useAuth() as AuthContextType;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
<<<<<<< HEAD
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // OTP State (6 boxes)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSetup = !user?.otp_enabled;

  const redirectUser = useCallback((userData: any) => {
    if (userData?.is_instructor) return router.push("/instructor");
=======
  const [otpCode, setOtpCode] = useState("");
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [secretKey, setSecretKey] = useState<string | null>(null);    
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  const verificationTriggered = useRef(false);
  const isSetup = !user?.otp_enabled;

  // Memoize redirection logic
  const redirectUser = useCallback((userData: any) => {
    const storedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem("post_2fa_redirect") : null;
    if (storedRedirect) {
      sessionStorage.removeItem("post_2fa_redirect");
      router.push(storedRedirect);
      return;
    }
    if (userData?.is_instructor) return router.push("/studio");
>>>>>>> develop
    if (userData?.student_profile?.onboarding_completed) return router.push("/dashboard");
    router.push("/onboarding");
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

<<<<<<< HEAD
=======
    // Skip if already a staff member with special access
>>>>>>> develop
    if (user.is_superuser || user.is_staff) {
      router.replace("/admin/dashboard");
      return;
    }

<<<<<<< HEAD
    if (isSetup && !qrCode) {
      fetchApi("/api/private/users/2fa/enable/", { method: "POST" })
        .then((data: any) => {
          setQrCode(data.qr_code);
          setSecretKey(data.secret);
=======
    if (isSetup && !initialized) {
      setInitialized(true);
      fetchApi("/api/private/users/2fa/enable/", { method: "POST" })
        .then((data: any) => {
          if (data && data.qr_code && data.secret) {
            setQrCode(data.qr_code);
            setSecretKey(data.secret);
          } else {
            setError("Données de configuration 2FA inattendues.");
          }
>>>>>>> develop
        })
        .catch(() => setError("Impossible de générer le code QR."))
        .finally(() => setLoading(false));
    } else {
<<<<<<< HEAD
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
=======
      if (!isSetup) {
        setLoading(false);
      }
    }
  }, [user, authLoading, router, isSetup, initialized]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6 || submitting) return;
>>>>>>> develop

    setSubmitting(true);
    setError(null);

    try {
      await fetchApi("/api/private/users/2fa/verify/", {
        method: "POST",
<<<<<<< HEAD
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
=======
        body: JSON.stringify({ otp_token: otpCode }),
      });

      setTwoFactorVerified(true);
      const freshUser = await checkAuth();
      if (freshUser) {
        redirectUser(freshUser);
      }
    } catch (err: any) {
      setError("Le code est incorrect ou expiré.");
      setOtpCode(""); // Reset pour permettre de retaper
      verificationTriggered.current = false;
>>>>>>> develop
    } finally {
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin mb-4" />
        <p className="text-xs font-medium text-slate-500">Préparation de la sécurité...</p>
=======
  // Sync otpArray values when otpCode is reset
  useEffect(() => {
    if (otpCode === "") {
      setOtpArray(Array(6).fill(""));
      inputRefs[0].current?.focus();
    }
  }, [otpCode]);

  // Auto-submit when 6 digits are reached
  useEffect(() => {
    if (otpCode.length === 6 && !submitting && !verificationTriggered.current) {
      verificationTriggered.current = true;
      handleVerify();
    } else if (otpCode.length !== 6) {
      verificationTriggered.current = false;
    }
  }, [otpCode, submitting]);

  const handleCopy = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/api/private/users/2fa/enable/", { method: "POST" });
      if (data && data.qr_code && data.secret) {
        setQrCode(data.qr_code);
        setSecretKey(data.secret);
      } else {
        setError("Données de configuration 2FA inattendues.");
      }
    } catch {
      setError("Impossible de régénérer le code QR.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newOtp = [...otpArray];
      newOtp[index] = "";
      setOtpArray(newOtp);
      setOtpCode(newOtp.join(""));
      return;
    }

    const char = cleanValue.slice(-1);
    const newOtp = [...otpArray];
    newOtp[index] = char;
    setOtpArray(newOtp);
    setOtpCode(newOtp.join(""));

    if (index < 5 && char) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
        const newOtp = [...otpArray];
        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        setOtpCode(newOtp.join(""));
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpArray(newOtp);
      setOtpCode(newOtp.join(""));
      
      const targetIndex = Math.min(pastedData.length, 5);
      inputRefs[targetIndex].current?.focus();
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
>>>>>>> develop
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">

          <div className="flex justify-between items-start mb-8">
            <div className={"w-12 h-12 rounded-lg flex items-center justify-center border ${isSetup ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-900'}"}>
              {isSetup ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
            </div>
            <button onClick={() => logout()} className="text-slate-400 hover:text-rose-600 transition-colors p-2" title="Déconnexion">
=======
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[var(--brand-50)] rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="card p-8 rounded-3xl border-[var(--border-default)] shadow-xl relative bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isSetup ? 'bg-[var(--brand-50)] border-[var(--brand-100)] text-[var(--brand-500)]' : 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]'}`}>
              {isSetup ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
            </div>
            <button
              onClick={() => logout()}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-2"
              title="Déconnexion"
            >
>>>>>>> develop
              <LogOut size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-8">
<<<<<<< HEAD
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {isSetup ? "Sécurisez votre compte" : "Vérification 2FA"}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isSetup
                ? "Scannez le QR Code avec l'application Authenticator"
                : "Entrez le code à 6 chiffres généré par votre application d'authentification."}
=======
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {isSetup ? "Sécurisez votre compte" : "Vérification 2FA"}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              {isSetup
                ? "Scannez le QR Code pour lier votre application (Google Authenticator, Authy...)"
                : "Entrez le code généré par votre application."}
>>>>>>> develop
            </p>
          </div>

          {isSetup && qrCode && secretKey && (
<<<<<<< HEAD
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
=======
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] p-3 rounded-2xl mb-4 shadow-sm">
                <Image 
                  src={`data:image/svg+xml;base64,${qrCode}`} 
                  alt="QR Code" 
                  width={180} 
                  height={180} 
                  unoptimized 
                />
              </div>
              
              {/* Clé secrète manuelle */}
              <div className="w-full text-center space-y-2 mb-2">
                <p className="text-xs text-[var(--text-tertiary)] font-bold">
                  Impossible de scanner ? Saisissez cette clé :
                </p>
                <div className="flex items-center justify-between gap-2 bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm text-[var(--text-primary)] font-mono tracking-widest break-all">
                    {secretKey ? secretKey.match(/.{1,4}/g)?.join(' ') : ""} 
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors flex-shrink-0 flex items-center gap-1.5"
                    title="Copier la clé"
                  >
                    <Copy className="w-4 h-4" />
                    {copied && <span className="text-[10px] text-[var(--success)] font-bold uppercase tracking-wider">Copié !</span>}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="text-[10px] font-bold text-[var(--brand-500)] hover:text-[var(--brand-400)] transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> Régénérer le code QR
>>>>>>> develop
                  </button>
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
=======
          {/* ─── Formulaire OTP ─── */}
          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[var(--error-light)] border border-[var(--error)] text-[var(--error)] text-sm font-medium text-center shadow-sm">
>>>>>>> develop
                {error}
              </div>
            )}

<<<<<<< HEAD
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
=======
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1 block text-center">
                {isSetup ? "Code de confirmation (6 chiffres)" : "Code OTP"}
              </label>

              <div className="flex justify-between items-center gap-2 max-w-[280px] mx-auto py-2">
                {Array(6).fill(0).map((_, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    autoFocus={i === 0}
                    value={otpArray[i]}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-12 md:w-12 md:h-14 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl text-center text-xl font-bold font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] transition-all shadow-sm"
                  />
                ))}
              </div>

              <p className="text-[10px] text-[var(--text-tertiary)] text-center font-medium">
                {isSetup
                  ? "Scannez d'abord le QR Code puis entrez le code généré."
                  : "Ouvrez votre application Google Authenticator ou Authy."}
              </p>
>>>>>>> develop
            </div>

            <button
              type="submit"
<<<<<<< HEAD
              disabled={otp.join("").length !== 6 || submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
=======
              disabled={otpCode.length !== 6 || submitting}
              className="btn-primary w-full py-4 text-base shadow-md rounded-xl flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-6"
>>>>>>> develop
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSetup ? "Activer le 2FA" : "Vérifier le code"}
<<<<<<< HEAD
                  <ArrowRight className="w-4 h-4" />
=======
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
>>>>>>> develop
                </>
              )}
            </button>
          </form>
        </div>
<<<<<<< HEAD

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Un problème de connexion ? <a href="#" className="font-medium text-slate-600 hover:text-slate-900 hover:underline">Contactez le support</a>
          </p>
        </div>
=======
>>>>>>> develop
      </div>
    </div>
  );
}