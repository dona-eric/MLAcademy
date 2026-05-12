"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { 
  Settings as SettingsIcon, Shield, Bell, 
  Lock, CreditCard, HelpCircle, LogOut, 
  ChevronRight, Sparkles, User, Mail, 
  Eye, EyeOff, ShieldCheck, Zap
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const TABS = [
    { id: "account", label: "Compte", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Paiements", icon: CreditCard },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#090C14] text-white p-6 lg:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
              <SettingsIcon className="w-3 h-3" /> Paramètres Système
            </div>
            <h1 className="text-4xl font-black tracking-tight">Configuration</h1>
            <p className="text-slate-500 font-medium text-lg">Gérez vos préférences et la sécurité de votre compte.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Nav */}
          <div className="space-y-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
            
            <div className="pt-8">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm border border-transparent"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 animate-in slide-in-from-right-4 duration-500">
            
            {activeTab === "account" && (
              <div className="space-y-8">
                <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
                  <h3 className="text-xl font-black tracking-tight">Informations de connexion</h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse Email</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-400 flex items-center gap-3">
                          <Mail className="w-4 h-4 text-slate-600" />
                          {user.email}
                        </div>
                        <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Modifier</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                      <div className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight">Espace Instructeur</h3>
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Status Instructeur</p>
                      <p className="text-xs text-slate-500">Votre compte est actuellement configuré comme {user.is_instructor ? "Instructeur" : "Étudiant"}.</p>
                    </div>
                    {user.is_instructor ? (
                      <Link href="/instructor" className="btn bg-indigo-500 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20">
                        Accéder au Studio
                      </Link>
                    ) : (
                      <Link href="/instructor/apply" className="btn bg-white text-black px-6 py-2 rounded-xl text-xs font-bold">
                        Devenir Instructeur
                      </Link>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
                  <h3 className="text-xl font-black tracking-tight">Changement de mot de passe</h3>
                  <div className="grid gap-6">
                    <button className="btn bg-white/5 border border-white/10 text-white w-full py-4 rounded-2xl flex items-center justify-between px-6 hover:bg-white/10 transition-all font-bold">
                      <div className="flex items-center gap-4">
                        <Lock className="w-5 h-5 text-indigo-400" />
                        Réinitialiser mon mot de passe
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <p className="text-xs font-medium text-slate-400">Authentification à deux facteurs active.</p>
                    </div>
                  </div>
                </section>

                <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4">
                   <h3 className="text-xl font-black tracking-tight text-rose-500">Zone de danger</h3>
                   <p className="text-sm text-slate-500 font-medium">La suppression de votre compte est irréversible. Toutes vos données seront effacées de nos serveurs.</p>
                   <button className="text-sm font-black text-rose-500/50 hover:text-rose-500 transition-colors uppercase tracking-widest pt-4">Supprimer mon compte</button>
                </section>
              </div>
            )}

            {/* Fallback for other tabs */}
            {activeTab !== "account" && activeTab !== "security" && (
               <div className="glass-card p-16 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                  <HelpCircle className="w-12 h-12 text-slate-700" />
                  <h3 className="text-xl font-black">Bientôt disponible</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">Nous travaillons sur ces fonctionnalités pour vous offrir un contrôle total.</p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
