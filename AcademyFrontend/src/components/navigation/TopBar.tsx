"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Search, User as UserIcon } from "lucide-react";
import NotificationBell from "./NotificationBell";

function Avatar({ user }: { user: any }) {
<<<<<<< HEAD
  const baseClass = "relative h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 group-hover:border-indigo-300 transition-colors";
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      {user?.avatar_url
        ? <img className={"${baseClass} object-cover"} src={user.avatar_url} alt={user.username} />
        : <div className={"${baseClass} flex items-center justify-center"}>
          <UserIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
        </div>
=======
  const baseClass = "relative h-9 w-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] group-hover:border-[var(--brand-300)] transition-colors";
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[var(--brand-100)] blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      {user?.avatar_url
        ? <img className={`${baseClass} object-cover relative z-10`} src={user.avatar_url} alt={user.username} />
        : <div className={`${baseClass} flex items-center justify-center relative z-10`}>
            <UserIcon className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--brand-500)]" />
          </div>
>>>>>>> develop
      }
    </div>
  );
}

export default function TopBar() {
  const { user } = useAuth();

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">

      <button type="button" className="-m-2.5 p-2.5 text-slate-400 md:hidden hover:text-indigo-600 transition-colors">
=======
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">

      <button type="button" className="-m-2.5 p-2.5 text-[var(--text-secondary)] md:hidden hover:text-[var(--brand-500)] transition-colors">
>>>>>>> develop
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

<<<<<<< HEAD
      <div className="h-6 w-px bg-slate-200 md:hidden" aria-hidden="true" />
=======
      <div className="h-6 w-px bg-[var(--border-default)] md:hidden" aria-hidden="true" />
>>>>>>> develop

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Recherche */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Rechercher</label>
<<<<<<< HEAD
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-slate-400" aria-hidden="true" />
=======
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-[var(--text-tertiary)]" aria-hidden="true" />
>>>>>>> develop
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Recherche IA, Cours, Experts..."
<<<<<<< HEAD
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm bg-transparent outline-none"
=======
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-0 sm:text-sm bg-transparent outline-none"
>>>>>>> develop
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <NotificationBell />

<<<<<<< HEAD
          <div className="hidden lg:block lg:h-5 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profil */}
          <button className="-m-1.5 flex items-center p-1.5 hover:bg-slate-50 rounded-2xl transition-all duration-300 group">
            <span className="sr-only">Menu utilisateur</span>
            <Avatar user={user} />
            <span className="hidden lg:flex lg:items-center">
              <div className="ml-4 flex flex-col items-start">
                <span className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
                  {user?.first_name || user?.username}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-1">
=======
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
>>>>>>> develop
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