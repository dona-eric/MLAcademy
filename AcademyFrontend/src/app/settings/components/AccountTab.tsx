"use client";

import Link from "next/link";
import { UserProfile } from "@/types/user";
import { Mail, Zap, Calendar, GraduationCap, Award, Clock, Star } from "lucide-react";

interface AccountTabProps {
  user: UserProfile;
}

export function AccountTab({ user }: AccountTabProps) {
  const formattedDate = user.date_joined 
    ? new Date(user.date_joined).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Non spécifiée";

  const role = user.is_superuser
    ? "Administrateur"
    : user.is_instructor
    ? "Instructeur / Mentor"
    : "Apprenant Standard";

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Accès & Identité */}
      <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D1FF]/5 blur-3xl rounded-full"></div>
        <h3 className="text-xl font-black uppercase tracking-tight">Accès & Identité</h3>
        
        {/* User Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#0A192F] border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center space-y-2">
            <GraduationCap className="w-6 h-6 text-[#00D1FF]" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cours Terminés</p>
            <p className="text-2xl font-black text-white">{user.stats?.coursesCompleted || 0}</p>
          </div>

          <div className="bg-[#0A192F] border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center space-y-2">
            <Award className="w-6 h-6 text-emerald-400" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Certificats</p>
            <p className="text-2xl font-black text-white">{user.stats?.certificates || 0}</p>
          </div>

          <div className="bg-[#0A192F] border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center space-y-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Heures d'Étude</p>
            <p className="text-2xl font-black text-white">{user.stats?.learningHours || 0}h</p>
          </div>

          <div className="bg-[#0A192F] border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center space-y-2">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Niveau {user.stats?.levelNumber || 1}</p>
            <p className="text-2xl font-black text-white">{user.xp_points || 0} XP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nom Complet</label>
            <div className="bg-[#0A192F] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white uppercase tracking-wider">
              {user.first_name || user.last_name 
                ? `${user.first_name} ${user.last_name}`.trim()
                : "Non renseigné"}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Adresse Email</label>
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

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Date de Création</label>
            <div className="bg-[#0A192F] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-gray-400 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-700" />
              {formattedDate}
            </div>
          </div>
        </div>
      </section>

      {/* Privilèges */}
      <section className="bg-[#112240] p-10 rounded-[3rem] border border-white/5 space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tight">Privilèges Système</h3>
          <Zap className="w-6 h-6 text-[#00D1FF]" />
        </div>
        <div className="p-8 bg-[#0A192F] rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.3em]">Status de Licence</p>
            <p className="text-sm font-bold text-gray-400">Votre profil est actuellement configuré comme : <span className="text-white font-black uppercase tracking-wide">{role}</span>.</p>
          </div>
          {user.is_instructor ? (
            <Link href="/studio" className="bg-[#00D1FF] text-[#0A192F] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#00D1FF]/10 transition-transform hover:scale-105">
              Studio Mentor
            </Link>
          ) : (
            <Link href="/devenir-instructeur" className="bg-white text-[#0A192F] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 animate-pulse">
              Devenir Instructeur
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
