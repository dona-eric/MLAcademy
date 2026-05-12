"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, MapPin, Briefcase, Zap, Globe, Edit3, Award, BookOpen, Clock, ShieldCheck, ChevronRight, Sparkles, Star, Play
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const stats = user?.stats || {
    coursesCompleted: 0,
    certificates: 0,
    learningHours: 0,
    points: 0
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#090C14]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#090C14] text-white p-4 lg:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-700">
        
        {/* Header / Cover Section */}
        <div className="relative group">
          <div className="h-40 w-full rounded-[32px] bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-cyan-900/40 border border-white/5 overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          </div>
          
          <div className="absolute -bottom-12 left-8 flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-[#0A0F1C] border-2 border-white/5 overflow-hidden shadow-2xl relative">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-500/5">
                    <User className="w-10 h-10 text-indigo-400/50" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-emerald-500 border-2 border-[#090C14] flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            
            <div className="mb-2 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {user.first_name} {user.last_name}
                </h1>
                {user.is_instructor && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-500/20">
                    Expert
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-bold flex items-center gap-2">
                @{user.username} • {user.level || "Apprenti"}
              </p>
            </div>
          </div>

          <Link href="/profile/edit" className="absolute bottom-4 right-6 bg-white/5 hover:bg-white/10 text-white border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs font-bold">
            <Edit3 className="w-3.5 h-3.5" /> Editer
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-xl font-black text-white">{stats.coursesCompleted}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cours</p>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-xl font-black text-amber-400">{stats.points}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">XP</p>
              </div>
            </div>

            {/* About */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Bio
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium bg-white/5 p-5 rounded-2xl border border-white/5">
                {user.bio || "Aucune bio renseignée."}
              </p>
            </section>

            {/* Links */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Liens</h3>
              <div className="grid gap-2">
                {[
                  { icon: <FaLinkedin className="w-3.5 h-3.5" />, label: "LinkedIn", value: user.linkedin_url },
                  { icon: <FaGithub className="w-3.5 h-3.5" />, label: "GitHub", value: user.github_url },
                  { icon: <Globe className="w-3.5 h-3.5" />, label: "Web", value: user.portfolio_url },
                ].map((link, i) => (
                  <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 ${link.value ? 'hover:bg-white/10 opacity-100' : 'opacity-30'}`}>
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span className="text-xs font-bold text-white">{link.label}</span>
                    </div>
                    {link.value && <ChevronRight className="w-3 h-3 text-slate-500" />}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Badges */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Distinctions
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: <Zap className="w-5 h-5 text-amber-400" />, color: "amber" },
                  { icon: <Target className="w-5 h-5 text-indigo-400" />, color: "indigo" },
                  { icon: <Star className="w-5 h-5 text-emerald-400" />, color: "emerald" },
                  { icon: <Award className="w-5 h-5 text-rose-400" />, color: "rose" },
                ].map((badge, i) => (
                  <div key={i} className="glass-card aspect-square rounded-2xl border border-white/5 flex items-center justify-center group hover:border-white/20 transition-all">
                    <div className={`w-10 h-10 rounded-xl bg-${badge.color}-500/10 flex items-center justify-center shadow-lg`}>
                      {badge.icon}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Activité
              </h3>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="glass-card rounded-2xl border border-white/5 p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                        <Play className="w-4 h-4 text-white/20" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Maîtriser PyTorch</p>
                        <p className="text-[10px] text-slate-500 font-medium">Terminé il y a 2 jours</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

function Target(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
