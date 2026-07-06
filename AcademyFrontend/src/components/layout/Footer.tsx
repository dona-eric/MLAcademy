import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Mail } from 'lucide-react';

const SOCIALS = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/dtech-africa', label: 'LinkedIn' },
<<<<<<< HEAD
  { icon: FaTwitter, href: 'https://twitter.com/dtech-africa', label: 'Twitter' },
  { icon: FaYoutube, href: 'https://www.youtube.com/dtech-africa', label: 'YouTube' },
  { icon: FaGithub, href: 'https://github.com/dtech-afrik', label: 'GitHub' },
=======
  { icon: FaTwitter,  href: 'https://twitter.com/dtech-africa', label: 'Twitter' },
  { icon: FaYoutube,  href: 'https://www.youtube.com/channel/UCO_v6Qz3jH_Q-2Wp3rFm7aQ', label: 'YouTube' },
  { icon: FaGithub,   href: 'https://github.com/dtech-afrik', label: 'GitHub' },
>>>>>>> develop
];

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
<<<<<<< HEAD
      { href: '/parcours', label: 'Parcours complets' },
      { href: '/projets', label: 'Projets réels' },
      { href: '/parcours?tab=paths', label: 'Certifications' },
      { href: '/instructor/apply', label: 'Devenir Instructeur', highlight: true },
=======
      { href: '/parcours',         label: 'Parcours complets' },
      { href: '/certifications',   label: 'Certifications' },
      { href: '/devenir-instructeur', label: 'Devenir Instructeur' },
>>>>>>> develop
    ],
  },
  {
    title: 'Ressources',
    links: [
<<<<<<< HEAD
      { href: '/forum', label: 'Communauté' },
      { href: '/discord', label: 'Serveur Discord' },
      { href: '/blog', label: 'Blog Tech' },
      { href: '/faq', label: 'Aide & FAQ' },
=======
      { href: '/communaute', label: 'Communauté' },
      { href: '/blog',       label: 'Blog Tech' },
      { href: '/faq',        label: 'Aide & FAQ' },
>>>>>>> develop
    ],
  },
];

const LEGAL_LINKS = [
<<<<<<< HEAD
  { href: '/legal', label: 'Mentions Légales' },
  { href: '/privacy', label: 'Confidentialité' },
];

const linkClass = 'text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors';

export default function Footer() {
  return (
    <footer className="footer-container border-t border-white/5 bg-[#090C14] pt-20 pb-10 overflow-hidden relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-16 mb-16">

          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Image src="/mlacademy_logo.png" alt="MLAcademy Logo" fill sizes="48px" className="object-cover" priority />
              </div>
              <span className="text-2xl font-black text-indigo-400 tracking-tight">MLAcademy</span>
            </Link>

            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              La plateforme francophone de référence pour l'apprentissage du Machine Learning et de la Data Science par la pratique.
            </p>

            <div className="flex items-center gap-4">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link key={label} href={href} aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all">
                  <Icon className="w-5 h-5" />
=======
  { href: '/legal',   label: 'Mentions Légales' },
  { href: '/privacy', label: 'Confidentialité' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--border-default)] shadow-sm group-hover:scale-105 transition-transform">
                <Image src="/images/mlacademy_logo_final.png" alt="MLAcademy Logo" fill sizes="40px" className="object-cover" priority />
              </div>
              <span className="text-xl font-extrabold text-[var(--brand-500)] tracking-tight">MLAcademy</span>
            </Link>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
              La plateforme francophone de référence pour l'apprentissage du Machine Learning et de la Data Science par la pratique.
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--brand-500)] hover:border-[var(--brand-200)] transition-all"
                >
                  <Icon className="w-4 h-4" />
>>>>>>> develop
                </Link>
              ))}
            </div>
          </div>

<<<<<<< HEAD
          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title} className="space-y-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{title}</h4>
                <nav className="flex flex-col gap-4">
                  {links.map(({ href, label, highlight }) => (
                    <Link key={href} href={href} className={"${linkClass} ${highlight ? 'text-indigo-400/80' : ''}"}>
=======
          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{title}</h4>
                <nav className="flex flex-col gap-3">
                  {links.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors"
                    >
>>>>>>> develop
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            {/* Contact */}
<<<<<<< HEAD
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Contact</h4>
              <a href="mailto:dtech.afrik@gmail.com" className={"${linkClass} flex items-center gap-2"}>
                <Mail className="w-4 h-4" /> dtech.afrik@gmail.com
=======
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Contact</h4>
              <a href="mailto:contact@mlacademy.io" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> contact@mlacademy.io
>>>>>>> develop
              </a>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} MLAcademy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-8">
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
=======
        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-primary)]">
            © {new Date().getFullYear()} MLAcademy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors"
              >
>>>>>>> develop
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}