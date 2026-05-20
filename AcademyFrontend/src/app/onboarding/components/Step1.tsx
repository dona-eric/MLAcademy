"use client";
import { CheckCircle2 } from "lucide-react";
import { DOMAINS } from "@/types/constant";
import { OnboardingData } from "@/types/info";

const plural = (count: number, word: string) =>
  `${count} ${word}${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`;

export default function Step1({ data, toggleDomain }: { data: OnboardingData; toggleDomain: (id: string) => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
          Votre domaine de <span className="text-indigo-400">formation</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Sélectionnez un ou plusieurs domaines qui vous intéressent. Nous vous proposerons les formations adaptées.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DOMAINS.map((domain) => {
          const isSelected = data.domains.includes(domain);
          return (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`relative py-4 px-5 rounded-2xl border transition-all text-left group ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : "border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <span className={`text-xs font-bold tracking-tight ${isSelected ? "text-indigo-300" : "text-slate-300"}`}>
                {domain}
              </span>
              {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-400" />}
            </button>
          );
        })}
      </div>

      {data.domains.length > 0 && (
        <p className="text-xs text-slate-500">
          <span className="text-indigo-400 font-bold">{data.domains.length}</span> {plural(data.domains.length, "domaine")}
        </p>
      )}
    </div>
  );
}