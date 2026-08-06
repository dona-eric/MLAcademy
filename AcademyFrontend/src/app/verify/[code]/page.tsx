"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Download,
  Calendar,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { LinkedInAddButton } from "@/components/certificates/LinkedInAddButton";

interface CertificateVerificationData {
  valid: boolean;
  certificate_id: string;
  verification_hash: string;
  cert_type: string;
  cert_type_display: string;
  student_name: string;
  target_title: string;
  final_score: number;
  issued_at: string;
  pdf_url: string | null;
}

export default function PublicVerifyCertificatePage() {
  const params = useParams();
  const code = (params?.code as string) || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cert, setCert] = useState<CertificateVerificationData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    loadCertificate();
  }, [code]);

  async function loadCertificate() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi(`/api/learning/certificates/${code}/verify/`);
      if (data && data.certificate_id) {
        setCert(data);
      } else {
        setError("Certificat introuvable ou numéro invalide.");
      }
    } catch (err: any) {
      console.error("Erreur lors de la vérification du certificat:", err);
      setError("Le certificat demandé n'existe pas ou le code de vérification est incorrect.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col font-sans relative overflow-hidden">
      {/* Glow ambiant décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-indigo-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* En-tête Navigation */}
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-white font-black text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20">
              <Award className="w-5 h-5 fill-current" />
            </div>
            <span>MLACADEMY</span>
          </a>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Registre Officiel d'Authenticité</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="text-sm font-medium text-slate-400">Vérification de la signature cryptographique...</p>
          </div>
        ) : error || !cert ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Certificat Non Validé</h2>
            <p className="text-sm text-slate-300 mb-8">{error}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/10 transition-all"
            >
              Retour à l'accueil
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Badge Status Banner */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    <span>Authentifié & Vérifié</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Certificat Officiel MLAcademy
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
                </button>
              </div>
            </div>

            {/* Global Certificate Details Card */}
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
              {/* Recipient Header */}
              <div className="border-b border-white/10 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                    Titulaire de la certification
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {cert.student_name}
                  </h2>
                </div>

                <div className="md:text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Type de document
                  </span>
                  <p className="text-lg font-bold text-slate-200">
                    {cert.cert_type_display}
                  </p>
                </div>
              </div>

              {/* Course Title & Details */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Programme complété avec succès
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#5de6ff] leading-snug">
                  « {cert.target_title} »
                </h3>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Date de délivrance</span>
                  </div>
                  <p className="text-sm font-bold text-white">{formattedDate}</p>
                </div>

                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>Score obtenu</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">{cert.final_score}% / 100%</p>
                </div>

                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>ID Certificat</span>
                  </div>
                  <p className="text-sm font-mono font-bold text-slate-200">{cert.certificate_id}</p>
                </div>
              </div>

              {/* Cryptographic SHA-256 Fingerprint */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Empreinte Cryptographique SHA-256 (Anti-Truquage)
                </span>
                <p className="font-mono text-cyan-300 break-all select-all font-bold">
                  {cert.verification_hash || "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <LinkedInAddButton
                  courseTitle={cert.target_title}
                  certificateId={cert.certificate_id}
                  issueDate={cert.issued_at}
                />

                <a
                  href={`/api/learning/certificates/${cert.certificate_id}/download/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs sm:text-sm font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Diplôme PDF</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 MLAcademy — Système Officiel d'Attestation et de Certification en IA.</p>
      </footer>
    </div>
  );
}
