"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  Camera, Upload, Palette, Link2, Globe,
  Save, X, User as UserIcon,
  Eye, Loader2, Check
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa6";

export default function InstructorCustomizationPage() {
  const { user } = useAuth();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "public">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    displayName: "",
    headline: "Machine Learning Engineer",
    bio: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    twitter_url: "",
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setProfile(p => ({
        ...p,
        displayName: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username || "",
      }));
    }

    async function loadProfile() {
      try {
        const data = await fetchApi("/api/studio/profile/");
        setProfile({
          displayName: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.username || "",
          headline: data.headline || "Machine Learning Engineer",
          bio: data.bio || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          portfolio_url: data.portfolio_url || "",
          twitter_url: data.twitter_url || "",
        });
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
        if (data.banner_url) setBannerPreview(data.banner_url);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("headline", profile.headline);
      formData.append("bio", profile.bio);
      formData.append("github_url", profile.github_url);
      formData.append("linkedin_url", profile.linkedin_url);
      formData.append("portfolio_url", profile.portfolio_url);
      formData.append("twitter_url", profile.twitter_url);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      await fetchApi("/api/studio/profile/", {
        method: "PATCH",
        body: formData
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="mt-3 text-[12px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Chargement de la configuration</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Personnalisation de la chaîne</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Gérez votre profil public d'instructeur</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl text-[12px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all">
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Enregistrement..." : saved ? "Enregistré !" : "Publier"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/[0.06]">
        {([
          { key: "profile", label: "Profil" },
          { key: "public", label: "Page Publique" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-8">
          {activeTab === "profile" && (
            <>
              {/* Banner */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-white">Image de la bannière</h2>
                  <span className="text-[11px] text-slate-600">Recommandé: 2048 × 1152 px, max 6 Mo</span>
                </div>
                <div
                  className="relative aspect-[3.5/1] bg-white/[0.03] border border-dashed border-white/[0.1] rounded-2xl overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-all"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-slate-700 mb-2 group-hover:text-slate-500 transition-colors" />
                      <p className="text-[12px] font-medium text-slate-600">Cliquez pour uploader</p>
                    </div>
                  )}
                  {bannerPreview && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                </div>
              </section>

              {/* Avatar */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-white">Photo de profil</h2>
                  <span className="text-[11px] text-slate-600">98 × 98 px min, PNG/JPG, max 4 Mo</span>
                </div>
                <div className="flex items-center gap-6">
                  <div
                    className="relative w-24 h-24 rounded-full overflow-hidden group cursor-pointer border-2 border-white/[0.08] hover:border-indigo-500/40 transition-colors"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-[12px] text-slate-500 max-w-xs">
                    Votre photo apparaîtra sur votre profil public, à côté de vos cours et dans la communauté.
                  </p>
                </div>
              </section>

              {/* Name & Headline */}
              <section className="space-y-4">
                <h2 className="text-[14px] font-bold text-white">Identité</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nom public</label>
                    <input
                      value={profile.displayName}
                      readOnly
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-slate-500 font-medium outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Titre professionnel</label>
                    <input
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-white font-medium outline-none focus:border-indigo-500/40 transition-all"
                      placeholder="Ex: Machine Learning Engineer"
                    />
                  </div>
                </div>
              </section>

              {/* Bio */}
              <section className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Biographie</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={5}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 text-[13px] text-slate-300 outline-none focus:border-indigo-500/40 transition-all resize-none"
                  placeholder="Décrivez votre expertise, vos réalisations et ce que vous apportez à vos étudiants..."
                />
              </section>

              {/* Social Links */}
              <section className="space-y-4">
                <h2 className="text-[14px] font-bold text-white">Liens</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "github_url", label: "GitHub", icon: FaGithub, placeholder: "https://github.com/username" },
                    { key: "linkedin_url", label: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/in/username" },
                    { key: "portfolio_url", label: "Portfolio", icon: Globe, placeholder: "https://monsite.com" },
                    { key: "twitter_url", label: "X / Twitter", icon: FaTwitter, placeholder: "https://x.com/username" },
                  ].map((link) => (
                    <div key={link.key} className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <link.icon className="w-3 h-3" /> {link.label}
                      </label>
                      <input
                        value={(profile as any)[link.key]}
                        onChange={(e) => setProfile({ ...profile, [link.key]: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-slate-400 outline-none focus:border-indigo-500/40 transition-all"
                        placeholder={link.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === "public" && (
            <div className="text-center py-20 space-y-4">
              <Palette className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-[14px] font-semibold text-white">Éditeur de page publique</p>
              <p className="text-[12px] text-slate-500 max-w-md mx-auto">
                Personnalisez votre page publique d'instructeur avec des sections personnalisées, des témoignages et une mise en avant de vos meilleurs cours. À venir bientôt.
              </p>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
            <Eye className="w-4 h-4" />
            <span>Aperçu du profil</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Banner Preview */}
            <div className="aspect-[3.5/1] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 relative">
              {bannerPreview && (
                <img src={bannerPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>

            {/* Avatar + Info */}
            <div className="px-5 pb-5 -mt-8 relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#090C14] overflow-hidden bg-gradient-to-br from-indigo-500/30 to-purple-500/30 mb-3">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-7 h-7 text-slate-500" />
                  </div>
                )}
              </div>

              <h3 className="text-[15px] font-bold text-white">{profile.displayName || "Votre nom"}</h3>
              <p className="text-[12px] text-indigo-400 font-medium mt-0.5">{profile.headline || "Titre professionnel"}</p>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-3">
                {profile.bio || "Votre biographie apparaîtra ici..."}
              </p>

              {/* Social Links Preview */}
              <div className="flex items-center gap-2 mt-4">
                {profile.github_url && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><FaGithub className="w-3.5 h-3.5 text-slate-400" /></div>
                )}
                {profile.linkedin_url && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><FaLinkedin className="w-3.5 h-3.5 text-slate-400" /></div>
                )}
                {profile.portfolio_url && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><Globe className="w-3.5 h-3.5 text-slate-400" /></div>
                )}
                {profile.twitter_url && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><FaTwitter className="w-3.5 h-3.5 text-slate-400" /></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
