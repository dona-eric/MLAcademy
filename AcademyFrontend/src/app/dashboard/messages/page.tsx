import { Construction, MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-indigo-500" />
      </div>
      <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
        Messagerie Privée
      </h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        L'espace de messagerie interne permettant d'échanger avec vos instructeurs et mentors est en cours de construction.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold border border-amber-200">
        <Construction className="w-4 h-4" />
        Bientôt disponible
      </div>
    </div>
  );
}
