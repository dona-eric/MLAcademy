"use client";

import { useState } from "react";
import { Brain, Cpu, Sparkles, BookOpen, Award, Code, Terminal, Layers } from "lucide-react";

interface CourseImageProps {
  src: string | null | undefined;
  title: string;
  categoryName?: string;
  isPath?: boolean;
  className?: string;
}

export default function CourseImage({ src, title, categoryName, isPath = false, className = "h-full w-full object-cover" }: CourseImageProps) {
  const [error, setError] = useState(false);

  // Resolve absolute URL for relative paths returned by Django API
  const getAbsoluteUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    if (path.startsWith("/media/")) {
      return `${apiBase}${path}`;
    }
    if (path.startsWith("media/")) {
      return `${apiBase}/${path}`;
    }
    return `${apiBase}/media/${path}`;
  };

  const absoluteSrc = getAbsoluteUrl(src);

  // Generate a stable color palette index based on the title
  const getGradientIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 5;
  };

  const idx = getGradientIndex(title);

  // Curated, harmonious premium dark mode color gradients
  const gradients = [
    "from-indigo-650 via-slate-900 to-purple-950/90", // Deep royal indigo
    "from-purple-700 via-indigo-950 to-pink-950/80",   // GenAI Cyberpunk
    "from-blue-700 via-slate-950 to-emerald-950/80",   // MLOps & Production
    "from-violet-850 via-slate-950 to-indigo-900/80",   // Mathematics / Science
    "from-cyan-700 via-indigo-950 to-blue-950/90"      // AI & Engineering
  ];

  const gradientClass = gradients[idx];

  // Pick a fitting premium icon based on keywords in the title or category
  const getIcon = () => {
    const text = (title + " " + (categoryName || "")).toLowerCase();
    if (isPath) return Award;
    if (text.includes("deep") || text.includes("neur") || text.includes("math") || text.includes("stat")) return Brain;
    if (text.includes("mlops") || text.includes("production") || text.includes("aws") || text.includes("cloud")) return Cpu;
    if (text.includes("prompt") || text.includes("gen") || text.includes("gpt") || text.includes("llm")) return Sparkles;
    if (text.includes("python") || text.includes("code") || text.includes("science")) return Code;
    if (text.includes("pratique") || text.includes("masterclass")) return Terminal;
    return BookOpen;
  };

  const IconComponent = getIcon();

  if (absoluteSrc && !error) {
    return (
      <img
        src={absoluteSrc}
        alt={title}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-tr ${gradientClass} ${className} overflow-hidden`}>
      {/* Abstract Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#090C14_80%)] opacity-60 z-1" />
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Floating Glowing Aura */}
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/20 blur-3xl rounded-full animate-pulse duration-[8000ms]" />
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-500/10 blur-3xl rounded-full animate-pulse duration-[6000ms]" />

      <div className="relative flex flex-col items-center gap-3 z-10 p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300">
          <IconComponent className="w-8 h-8 text-white/80 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        </div>
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block max-w-[180px] truncate">
          {categoryName || (isPath ? "Parcours Certifiant" : "Formation")}
        </span>
      </div>
    </div>
  );
}
