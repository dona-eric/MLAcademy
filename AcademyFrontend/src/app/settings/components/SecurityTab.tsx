"use client";

import Link from "next/link";
import { UserProfile } from "@/types/user";
import { Lock, ChevronRight, ShieldCheck, ShieldAlert } from "lucide-react";

interface SecurityTabProps {
  user: UserProfile;
  onDeleteClick: () => void;
}

export function SecurityTab({ user, onDeleteClick }: SecurityTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10">
        <h3 className="text-xl font-black uppercase tracking-tight">Sécurité des Accès</h3>
        <div className="grid gap-6">
          <Link href="/settings/change-password" className="bg-[#0A192F] border border-white/5 text-white w-full py-6 rounded-[2rem] flex items-center justify-between px-8 hover:border-[#00D1FF]/30 transition-all font-black text-[10px] uppercase tracking-widest group">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#00D1FF]" />
              </div>
              Changer la Clé d'Accès (Password)
            </div>
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-all" />
          </Link>

          {user.otp_enabled ? (
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 w-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <p className="text-sm font-black text-white uppercase tracking-tight">Protection 2FA Active</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Votre compte est sécurisé contre les accès non autorisés.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 w-full">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-sm font-black text-white uppercase tracking-tight">2FA Non Activé</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                </div>
              </div>
              <Link href="/2fa" className="bg-[#0A192F] border border-white/5 text-white py-4 px-6 rounded-2xl hover:border-amber-500/30 transition-all font-black text-[10px] uppercase tracking-widest text-center whitespace-nowrap">
                Activer le 2FA
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#112240]/50 p-10 rounded-[3rem] border border-rose-500/10 space-y-6">
        <div className="flex items-center gap-4 text-rose-500">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="text-xl font-black uppercase tracking-tight">Zone Critique</h3>
        </div>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          La désactivation de ce profil entraînera la suppression immédiate et définitive de tout votre historique d'apprentissage, vos certifications et vos données.
        </p>
        <button 
          onClick={onDeleteClick}
          className="text-[10px] font-black text-rose-500/40 hover:text-rose-500 transition-all uppercase tracking-[0.3em] pt-6 flex items-center gap-3"
        >
          Désintégrer le compte <div className="w-1 h-1 rounded-full bg-rose-500/40"></div>
        </button>
      </section>
    </div>
  );
}
