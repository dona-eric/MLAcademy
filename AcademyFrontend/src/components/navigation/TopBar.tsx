"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Search, User as UserIcon } from "lucide-react";
import NotificationBell from "./NotificationBell";

function Avatar({ user }: { user: any }) {
  const baseClass = "relative h-9 w-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] group-hover:border-[var(--brand-300)] transition-colors";
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[var(--brand-100)] blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      {user?.avatar_url
        ? <img className={`${baseClass} object-cover relative z-10`} src={user.avatar_url} alt={user.username} />
        : <div className={`${baseClass} flex items-center justify-center relative z-10`}>
            <UserIcon className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--brand-500)]" />
          </div>
      }
    </div>
  );
}

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">

      <button type="button" className="-m-2.5 p-2.5 text-[var(--text-secondary)] md:hidden hover:text-[var(--brand-500)] transition-colors">
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-[var(--border-default)] md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Recherche */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Rechercher</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Recherche IA, Cours, Experts..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-0 sm:text-sm bg-transparent outline-none"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <NotificationBell />

          <div className="hidden lg:block lg:h-5 lg:w-px lg:bg-[var(--border-default)]" aria-hidden="true" />

          {/* Profil */}
          <button className="-m-1.5 flex items-center p-1.5 hover:bg-[var(--bg-secondary)] rounded-xl transition-all duration-300 group border border-transparent hover:border-[var(--border-default)]">
            <span className="sr-only">Menu utilisateur</span>
            <Avatar user={user} />
            <span className="hidden lg:flex lg:items-center">
              <div className="ml-3 flex flex-col items-start pr-2">
                <span className="text-sm font-bold text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-500)] transition-colors">
                  {user?.first_name || user?.username}
                </span>
                <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-wider mt-1">
                  {user?.is_instructor ? "Expert Member" : "Student"}
                </span>
              </div>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}