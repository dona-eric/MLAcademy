"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User, Mail, MapPin, Briefcase, Zap, Globe, Edit3, Award, BookOpen, Clock, ShieldCheck, ChevronRight, Sparkles, Star, Play, Target as TargetIcon, Loader2
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
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00D1FF] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-inter selection:bg-[#00D1FF]/30 pb-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 pt-32 space-y-12 relative z-10 animate-in fade-in duration-1000">

        {/* Profile Header Card */}
        <div className="bg-[#112240] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-900/40 via-[#0A192F] to-[#00D1FF]/10 relative">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          </div>

          <div className="px-10 pb-12 relative">
            <div className="flex flex-col md:flex-row items-end gap-8 -mt-16">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] bg-[#0A192F] border-4 border-[#112240] overflow-hidden shadow-2xl relative transition-transform group-hover:scale-105 duration-500">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#112240]">
                      <User className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-[#00D1FF] border-4 border-[#112240] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-[#0A192F]" />
                </div>
              </div>

              <div className="flex-1 mb-2 space-y-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {user.first_name} {user.last_name}
                  </h1>
                  {user.is_instructor && (
                    <span className="px-3 py-1 bg-[#00D1FF]/10 text-[#00D1FF] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#00D1FF]/20">
                      Expert Mentor
                    </span>
                  )}
                </div>
                <p className="text-gray-400 font-bold flex items-center gap-3">
                  <span className="text-[#00D1FF]">@{user.username}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                  <span className="uppercase tracking-widest text-[10px]">{user.level || "Digital Apprentice"}</span>
                </p>
              </div>

              <Link href="/profile/edit" className="bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
                <Edit3 className="w-4 h-4" /> Mettre à jour
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Side: Stats & About */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#112240] p-8 rounded-[2.5rem] border border-white/5 text-center transition-transform hover:scale-105">
                <p className="text-3xl font-black text-white mb-1">{stats.coursesCompleted}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Labs Finis</p>
              </div>
              <div className="bg-[#112240] p-8 rounded-[2.5rem] border border-white/5 text-center transition-transform hover:scale-105 shadow-xl shadow-[#00D1FF]/5">
                <p className="text-3xl font-black text-[#00D1FF] mb-1">{stats.points}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Expérience</p>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[#112240] rounded-[2.5rem] border border-white/5 p-10 space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" /> Biométrie Digitale
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium bg-[#0A192F] p-6 rounded-[2rem] border border-white/5">
                {user.bio || "Aucune donnée biographique n'a été synchronisée sur ce profil."}
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-[#112240] rounded-[2.5rem] border border-white/5 p-10 space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Réseaux</h3>
              <div className="space-y-3">
                {[
                  { icon: <FaLinkedin className="w-4 h-4" />, label: "LinkedIn", value: user.linkedin_url, color: "text-blue-400" },
                  { icon: <FaGithub className="w-4 h-4" />, label: "GitHub", value: user.github_url, color: "text-white" },
                  { icon: <Globe className="w-4 h-4" />, label: "Portfolio", value: user.portfolio_url, color: "text-[#00D1FF]" },
                ].map((link, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 rounded-2xl bg-[#0A192F] border border-white/5 transition-all ${link.value ? 'hover:border-[#00D1FF]/20 cursor-pointer opacity-100' : 'opacity-20 grayscale'}`}>
                    <div className="flex items-center gap-4">
                      <span className={link.color}>{link.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{link.label}</span>
                    </div>
                    {link.value && <ChevronRight className="w-4 h-4 text-gray-700" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Achievements & Activity */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Achievements Section */}
            <div className="bg-[#112240] rounded-[3rem] border border-white/5 p-12 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <Award className="w-6 h-6 text-amber-500" /> Certifications & Badges
                </h3>
                <span className="text-[9px] font-black text-[#00D1FF] uppercase tracking-widest bg-[#00D1FF]/5 px-3 py-1 rounded-lg">4/12 Débloqués</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { icon: <Zap className="w-6 h-6" />, label: "Rapide", color: "text-amber-400", bg: "bg-amber-400/10" },
                  { icon: <TargetIcon className="w-6 h-6" />, label: "Précis", color: "text-indigo-400", bg: "bg-indigo-400/10" },
                  { icon: <Star className="w-6 h-6" />, label: "Elite", color: "text-[#00D1FF]", bg: "bg-[#00D1FF]/10" },
                  { icon: <Award className="w-6 h-6" />, label: "Expert", color: "text-rose-400", bg: "bg-rose-400/10" },
                ].map((badge, i) => (
                  <div key={i} className="group flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-[2rem] bg-[#0A192F] border border-white/5 flex items-center justify-center shadow-xl transition-all group-hover:scale-110 group-hover:border-white/10 relative overflow-hidden`}>
                      <div className={`absolute inset-0 ${badge.bg} opacity-20 blur-xl`}></div>
                      <span className={badge.color}>{badge.icon}</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#112240] rounded-[3rem] border border-white/5 p-12 space-y-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                <BookOpen className="w-6 h-6 text-[#00D1FF]" /> Flux d'Activité
              </h3>
              
              <div className="space-y-4">
                {[
                  { title: "Introduction à la Computer Vision", type: "Cours Terminé", time: "2h ago", icon: <CheckCircle2 className="w-4 h-4 text-[#00D1FF]" /> },
                  { title: "Architecture des Transformers", type: "Lab En Cours", time: "Hier", icon: <Play className="w-4 h-4 text-amber-500" /> },
                  { title: "Deep Learning Fondamentaux", type: "Certification Obtenue", time: "3 jours ago", icon: <Award className="w-4 h-4 text-emerald-500" /> }
                ].map((act, i) => (
                  <div key={i} className="bg-[#0A192F] rounded-[2rem] border border-white/5 p-6 flex items-center justify-between group hover:border-[#00D1FF]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#112240] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white uppercase tracking-tight">{act.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-[#00D1FF] uppercase tracking-widest">{act.type}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10"></span>
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{act.time}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-[#00D1FF] transition-all" />
                  </div>
                ))}
              </div>

              <button className="w-full py-5 rounded-2xl bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:bg-white/10 hover:text-white transition-all">
                Voir tout l'historique
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
