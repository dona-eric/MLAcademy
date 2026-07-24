"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles, } from "lucide-react";

export default function InstructorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      // Authentic Django Backend JWT Login Call
      await login(formData.email.trim(), formData.password);
      // Redirection to /studio handled via AuthContext for instructors
    } catch (err: any) {
      setError(
        err.message ||
          "Identifiants incorrects ou compte instructeur non encore activé."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#051424] text-[#d4e4fa] font-sans relative overflow-x-hidden">
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(93,230,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                ML<span className="text-[#5de6ff]">Academy</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link
                href="/parcours"
                className="text-sm font-medium text-[#c7c4d7] hover:text-white transition-colors"
              >
                Formations
              </Link>
              <Link
                href="/certifications"
                className="text-sm font-medium text-[#c7c4d7] hover:text-white transition-colors"
              >
                Certifications
              </Link>
              <Link
                href="/communaute"
                className="text-sm font-medium text-[#c7c4d7] hover:text-white transition-colors"
              >
                Communauté
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#c7c4d7] hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="bg-[#8083ff] text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)]"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-stretch pt-20 min-h-screen relative z-10">
        {/* Left Side: Login Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Espace <span className="text-[#5de6ff]">Instructeur</span>
              </h1>
              <p className="text-[#c7c4d7] text-sm leading-relaxed">
                Connectez-vous avec les identifiants reçus par e-mail lors de la validation de votre candidature.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" id="loginForm">
              {/* Error Message */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-in fade-in duration-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-[#908fa0] uppercase tracking-widest block ml-1">
                  E-MAIL PROFESSIONNEL
                </label>
                <div className="flex items-center gap-3 bg-[#010f1f] border border-white/10 focus-within:border-[#5de6ff] focus-within:ring-1 focus-within:ring-[#5de6ff] rounded-xl px-4 py-3.5 transition-all group">
                  <Mail className="w-4 h-4 text-[#8083ff] group-focus-within:text-[#5de6ff] transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-transparent border-none focus:outline-none w-full text-white text-sm placeholder:text-white/20"
                    placeholder="nom@exemple.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-[#908fa0] uppercase tracking-widest block ml-1">
                  MOT DE PASSE
                </label>
                <div className="flex items-center gap-3 bg-[#010f1f] border border-white/10 focus-within:border-[#5de6ff] focus-within:ring-1 focus-within:ring-[#5de6ff] rounded-xl px-4 py-3.5 transition-all group">
                  <Lock className="w-4 h-4 text-[#8083ff] group-focus-within:text-[#5de6ff] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-transparent border-none focus:outline-none w-full text-white text-sm placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#c7c4d7] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Password reset */}
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded bg-[#010f1f] border-white/10 text-[#8083ff] focus:ring-[#8083ff]/50 transition-all"
                  />
                  <span className="text-[#c7c4d7] group-hover:text-white transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
                <Link
                  href="/password-reset"
                  className="text-[#5de6ff] hover:underline underline-offset-4 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c0c1ff] text-[#0d0096] hover:bg-[#8083ff] hover:text-white py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>CONNEXION EN COURS...</span>
                  </>
                ) : (
                  <>
                    <span>SE CONNECTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-[#c7c4d7]">
                Vous n'êtes pas encore instructeur ?{" "}
                <Link
                  href="/devenir-instructeur"
                  className="text-[#5de6ff] font-bold hover:underline ml-1"
                >
                  Postulez ici
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Branding / Testimonial */}
        <section className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center grayscale contrast-125 opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#051424]"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end p-16">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] max-w-xl shadow-[0_0_40px_rgba(93,230,255,0.1)]">
              <div className="bg-[#8083ff]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-[#8083ff]/30">
                <Sparkles className="w-6 h-6 text-[#5de6ff]" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                Plus qu'une plateforme, <span className="text-[#5de6ff]">une communauté.</span>
              </h2>
              <blockquote className="mb-6">
                <p className="text-[#d4e4fa] text-base leading-relaxed italic">
                  "L'Espace Studio me permet de créer des formations de très haute qualité avec une facilité déconcertante."
                </p>
                <footer className="mt-3 text-xs font-black text-[#5de6ff] uppercase tracking-wider">
                  — Outil Formateur MLAcademy
                </footer>
              </blockquote>
              <div className="flex gap-4 items-center pt-4 border-t border-white/10">
                <div className="flex -space-x-3">
                </div>
                <span className="text-xs text-[#c7c4d7] font-medium">
                  +500 experts nous ont rejoint
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
