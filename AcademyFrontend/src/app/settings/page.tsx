"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import {
  Settings as SettingsIcon, Shield, Bell,
  Lock, CreditCard, HelpCircle, LogOut,
  ChevronRight, Sparkles, User, Mail,
  Eye, EyeOff, ShieldCheck, Zap,
  Smartphone,
  ShieldAlert
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const TABS = [
    { id: "account", label: "Identité", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Alertes", icon: Bell },
    { id: "billing", label: "Facturation", icon: CreditCard },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-inter selection:bg-[#00D1FF]/30 pb-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 pt-32 space-y-16 relative z-10 animate-in fade-in duration-1000">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1FF]/10 rounded-full border border-[#00D1FF]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#00D1FF]">
              <SettingsIcon className="w-3.5 h-3.5" /> Configuration Système
            </div>
            <h1 className="text-5xl font-black tracking-tight uppercase">Settings</h1>
            <p className="text-gray-500 font-medium text-lg">Gérez vos accès, préférences et la sécurité de vos données.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Side Navigation */}
          <div className="lg:col-span-3 space-y-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#00D1FF] text-[#0A192F] shadow-xl shadow-[#00D1FF]/20' : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0A192F]"></div>}
              </button>
            ))}

            <div className="pt-8 mt-8 border-t border-white/5">
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-8 py-5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-9 space-y-12 animate-in slide-in-from-right-10 duration-700">

            {activeTab === "account" && (
              <div className="space-y-10">
                <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D1FF]/5 blur-3xl rounded-full"></div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Accès & Identité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Vecteur de Communication (Email)</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-[#0A192F] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-gray-400 flex items-center gap-4">
                          <Mail className="w-4 h-4 text-gray-700" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Identifiant Unique</label>
                      <div className="bg-[#0A192F] border border-white/5 rounded-2xl py-4 px-6 text-sm font-black text-[#00D1FF]">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tight">Privilèges Système</h3>
                    <Zap className="w-6 h-6 text-[#00D1FF]" />
                  </div>
                  <div className="p-8 bg-[#0A192F] rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <p className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.3em]">Status de Licence</p>
                      <p className="text-sm font-bold text-gray-400">Votre profil est actuellement taggé comme <span className="text-white uppercase">{user.is_instructor ? "Mentor / Instructeur" : "Apprenant Standard"}</span>.</p>
                    </div>
                    {user.is_instructor ? (
                      <Link href="/instructor" className="bg-[#00D1FF] text-[#0A192F] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#00D1FF]/10 transition-transform hover:scale-105">
                        Studio Mentor
                      </Link>
                    ) : (
                      <Link href="/instructor/apply" className="bg-white text-[#0A192F] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105">
                        Devenir Instructeur
                      </Link>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-xl font-black uppercase tracking-tight">Sécurité des Accès</h3>
                  <div className="grid gap-6">
                    <button className="bg-[#0A192F] border border-white/5 text-white w-full py-6 rounded-[2rem] flex items-center justify-between px-8 hover:border-[#00D1FF]/30 transition-all font-black text-[10px] uppercase tracking-widest group">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#00D1FF]" />
                        </div>
                        Changer la Clé d'Accès (Password)
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-all" />
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                        <p className="text-sm font-black text-white uppercase tracking-tight">Protection 2FA Active</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Votre compte est blindé contre les accès non autorisés.</p>
                      </div>
                    </div>
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
                  <button className="text-[10px] font-black text-rose-500/40 hover:text-rose-500 transition-all uppercase tracking-[0.3em] pt-6 flex items-center gap-3">
                    Désintégrer le compte <div className="w-1 h-1 rounded-full bg-rose-500/40"></div>
                  </button>
                </section>
              </div>
            )}

            {/* In Progress Tab Content */}
            {activeTab !== "account" && activeTab !== "security" && (
              <div className="bg-[#112240] p-24 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#0A192F] rounded-[2rem] border border-white/5 flex items-center justify-center shadow-2xl">
                  <Smartphone className="w-10 h-10 text-gray-700" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Module en Phase Beta</h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                    Cette fonctionnalité de configuration sera activée lors de la prochaine mise à jour système.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce delay-200"></div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
