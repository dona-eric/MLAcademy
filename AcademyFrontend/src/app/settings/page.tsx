"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { LogOut, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { SETTING_TABS, SettingsTab } from "@/types/setting";
import { AccountTab } from "./components/AccountTab";
import { SecurityTab } from "./components/SecurityTab";
import { NotificationTab } from "./components/NotificationTab";
import { BillingTab } from "./components/BillingTab";
import "../globals.css";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogOut = async () => {
    await logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== "SUPPRIMER" || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await fetchApi("/api/private/users/me/delete/", {
        method: "DELETE",
      });
      await logout();
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError("Une erreur est survenue lors de la suppression.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] pb-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--info-light)] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--brand-50)] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-60"></div>

      <div className="max-w-6xl mx-auto px-6 pt-24 space-y-12 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase">Paramètres</h1>
            <p className="text-[var(--text-secondary)] font-medium text-lg">Gérez vos accès, préférences et la sécurité de vos données.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Side Navigation */}
          <div className="lg:col-span-3 space-y-3">
            {SETTING_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border ${activeTab === tab.id ? "bg-white text-[var(--text-primary)] border-[var(--border-default)] shadow-sm" : "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-primary)] hover:border-[var(--border-subtle)]"}`}>
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[var(--brand-500)]" : ""}`} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)]"></div>}
              </button>
            ))}

            <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
              <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-bold text-xs uppercase tracking-widest border border-transparent">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-9 space-y-12">
            {activeTab === "account" && <AccountTab user={user} />}
            {activeTab === "security" && <SecurityTab user={user} onDeleteClick={() => setShowDeleteModal(true)} />}
            {activeTab === "notifications" && <NotificationTab />}
            {activeTab === "billing" && <BillingTab />}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full p-8 md:p-10 rounded-3xl border-rose-200 shadow-2xl relative space-y-6 bg-white">
            <div className="flex items-center gap-4 text-rose-600">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">Supprimer le compte ?</h3>
            </div>
            
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              Cette action est <strong className="text-rose-600">irréversible</strong>. Votre compte, vos certifications, et toutes vos données seront effacés définitivement.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest block">
                Pour confirmer, veuillez saisir <span className="text-rose-600 font-mono font-bold select-none">DELETE MY ACCOUNT</span> :
              </label>
              <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)} className="input-field font-mono uppercase" placeholder="SUPPRIMER"/>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-[var(--error-light)] border border-[var(--error)] text-[var(--error)] text-xs font-bold">
                {deleteError}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => {setShowDeleteModal(false);setConfirmDeleteText("");setDeleteError(null);}} className="flex-1 py-3.5 border border-[var(--border-default)] rounded-xl hover:bg-[var(--bg-secondary)] transition-all text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Annuler
              </button>
              <button type="button" disabled={confirmDeleteText !== "SUPPRIMER" || deleting} onClick={handleDeleteAccount} className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global override for child components */}
      <style jsx global>{`
        .glass-card {
          background: #ffffff;
          border: 1px solid var(--border-default);
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .text-white {
          color: var(--text-primary) !important;
        }
        .text-gray-400, .text-gray-500 {
          color: var(--text-secondary) !important;
        }
        .border-white\\/10, .border-white\\/5 {
          border-color: var(--border-default) !important;
        }
        .bg-white\\/5, .bg-white\\/10 {
          background-color: var(--bg-primary) !important;
        }
        .bg-[#112240] {
          background-color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
