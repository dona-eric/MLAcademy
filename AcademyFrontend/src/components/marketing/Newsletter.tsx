// "use client";

// import { useState } from "react";
// import { Mail, Sparkles, Send, CheckCircle } from "lucide-react";

// export default function Newsletter() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;
    
//     setStatus("loading");
//     // Simulation d'un appel API (ex: Mailchimp ou endpoint interne)
//     setTimeout(() => {
//       setStatus("success");
//       setEmail("");
//     }, 1200);
//   };

//   return (
//     <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-default)] p-8 md:p-12 shadow-lg">
//       <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-100)] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-40 pointer-events-none"></div>
      
//       <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
//         <div className="flex-1 space-y-4 text-center md:text-left">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-50)] text-[var(--brand-500)] text-xs font-bold uppercase tracking-wider mb-2">
//             <Sparkles className="w-4 h-4" />
//             <span>Rejoignez la communauté</span>
//           </div>
//           <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
//             Restez informé des dernières tendances IA
//           </h3>
//           <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
//             Recevez chaque semaine nos meilleurs articles, tutoriels et offres exclusives directement dans votre boîte mail.
//           </p>
//         </div>

//         <div className="w-full md:w-auto flex-1 max-w-md">
//           {status === "success" ? (
//             <div className="flex flex-col items-center justify-center p-6 bg-[var(--success-light)] border border-[var(--success)] rounded-xl text-center space-y-3 animate-in zoom-in duration-300">
//               <CheckCircle className="w-8 h-8 text-[var(--success)]" />
//               <div>
//                 <h4 className="text-[var(--text-primary)] font-bold">Inscription réussie !</h4>
//                 <p className="text-[var(--text-secondary)] text-sm">Merci, vérifiez votre boîte mail très bientôt.</p>
//               </div>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
//                 <input
//                   type="email"
//                   required
//                   placeholder="votre.email@exemple.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full h-12 pl-12 pr-4 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)] transition-all"
//                   disabled={status === "loading"}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={status === "loading" || !email}
//                 className="h-12 px-6 flex items-center justify-center gap-2 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group whitespace-nowrap shadow-md"
//               >
//                 {status === "loading" ? (
//                   <span className="flex items-center gap-2">
//                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Envoi...
//                   </span>
//                 ) : (
//                   <>
//                     <span>S'abonner</span>
//                     <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </form>
//           )}
//           <p className="text-xs text-[var(--text-tertiary)] mt-3 text-center md:text-left">
//             Pas de spam, désabonnement possible à tout moment.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
