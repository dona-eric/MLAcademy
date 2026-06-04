'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TalentProfile } from '@/types/talent';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function TalentProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchApi("/api/community/talents/${id}/");
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center text-[#dbdee1]">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-4 border-[#5865f2] border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-[#949ba4]">Chargement du profil talent...</p>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center p-10 text-white min-h-screen bg-[#1e1f22]">Profil introuvable.</div>;

  return (
    <div className="min-h-screen bg-[#1e1f22] text-[#dbdee1] p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Navigation retour */}
        <div className="mb-4">
          <Link href="/communaute" className="text-[#949ba4] hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <span>←</span> Retour à la communauté
          </Link>
        </div>

        {/* ================= HEADER CARD ================= */}
        <div className="bg-[#2b2d31] rounded-xl p-6 border border-[#3f4248] shadow-xl relative overflow-hidden">
          {/* Bannière décorative style Discord/GitHub */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#5865f2] to-[#4752c4]" />

          <div className="relative pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Infos Principales */}
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-[#383a40] border-4 border-[#2b2d31] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile.fullName?.substring(0, 2).toUpperCase() || profile.username?.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.fullName || profile.username}
                  <span className="text-xs font-normal text-[#949ba4]">@{profile.username}</span>
                </h1>
                <p className="text-[#dbdee1] font-medium mt-1 text-sm md:text-base">{profile.headline}</p>
                <p className="text-xs text-[#949ba4] mt-2">Membre depuis {profile.joinedAt}</p>
              </div>
            </div>

            {/* Zone Gamification (XP & Classement) */}
            <div className="flex items-center gap-4 bg-[#232428] p-4 rounded-lg border border-[#383a40] self-stretch md:self-auto justify-around">
              <div className="text-center px-4">
                <span className="block text-xs font-bold text-[#949ba4] uppercase tracking-wider">Rang</span>
                <span className="text-xl font-extrabold text-[#f1c40f]">🏆 #{profile.rank}</span>
              </div>
              <div className="w-px h-10 bg-[#3f4248]" />
              <div className="text-center px-4">
                <span className="block text-xs font-bold text-[#949ba4] uppercase tracking-wider">Score</span>
                <span className="text-xl font-extrabold text-[#5865f2]">{profile.xpPoints} <span className="text-xs font-normal text-[#949ba4]">XP</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CORPS PRINCIPAL (2 COLONNES) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLONNE GAUCHE (Bio, Compétences, Certificats) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-[#2b2d31] p-5 rounded-xl border border-[#3f4248]">
                <h2 className="text-sm font-bold text-[#949ba4] uppercase tracking-wider mb-3">À propos</h2>
                <p className="text-sm leading-relaxed text-[#dbdee1] whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {/* Compétences / Hard Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-[#2b2d31] p-5 rounded-xl border border-[#3f4248]">
                <h2 className="text-sm font-bold text-[#949ba4] uppercase tracking-wider mb-3">Stack Technique</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="bg-[#232428] text-[#dbdee1] border border-[#383a40] px-2.5 py-1 rounded text-xs font-medium hover:border-[#5865f2] transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications acquises */}
            {profile.certificates && profile.certificates.length > 0 && (
              <div className="bg-[#2b2d31] p-5 rounded-xl border border-[#3f4248]">
                <h2 className="text-sm font-bold text-[#949ba4] uppercase tracking-wider mb-3">Certificats MLAcademy</h2>
                <div className="space-y-3">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="flex gap-3 items-start p-2.5 rounded bg-[#232428] border border-[#383a40]">
                      <span className="text-xl">📜</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{cert.title}</h4>
                        <p className="text-[11px] text-[#949ba4] mt-0.5">{cert.issuer} • {cert.issuedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE (Portfolio de projets ML) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#2b2d31] p-6 rounded-xl border border-[#3f4248] h-full">
              <h2 className="text-sm font-bold text-[#949ba4] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>💻</span> Réalisations & Projets Capstone
              </h2>

              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="bg-[#232428] p-4 rounded-lg border border-[#383a40] flex flex-col justify-between hover:border-[#4f545c] transition-all duration-200">
                      <div>
                        <h3 className="font-bold text-white text-base mb-1.5 hover:text-[#5865f2] cursor-pointer transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[#949ba4] leading-relaxed line-clamp-3 mb-4">
                          {project.description}
                        </p>
                      </div>

                      <div>
                        {/* Tags de technos utilisées */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techStack.map((tech, i) => (
                            <span key={i} className="bg-[#1e1f22] text-[#949ba4] px-2 py-0.5 rounded text-[10px] font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Liens d'action */}
                        <div className="flex items-center gap-3 pt-2 border-t border-[#2b2d31]">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-[#dbdee1] hover:text-white flex items-center gap-1 font-medium bg-[#2b2d31] px-2.5 py-1 rounded border border-[#3f4248]">
                              🐙 GitHub
                            </a>
                          )}
                          {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-xs text-white bg-[#5865f2] hover:bg-[#4752c4] px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors">
                              🚀 Démo live
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 text-[#949ba4] border border-dashed border-[#3f4248] rounded-xl">
                  Aucun projet publié pour le moment.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
