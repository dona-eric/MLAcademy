"use client";

import { CreditCard } from "lucide-react";

export function BillingTab() {
  return (
    <div className="bg-[#112240] p-24 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-[#0A192F] rounded-[2rem] border border-white/5 flex items-center justify-center shadow-2xl">
        <CreditCard className="w-10 h-10 text-gray-700" />
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black uppercase tracking-tight">Facturation & Abonnements</h3>
        <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
          La gestion de la facturation et les offres d'abonnement Premium seront activées prochainement.
        </p>
      </div>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce delay-100"></div>
        <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce delay-200"></div>
      </div>
    </div>
  );
}
