import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Mail } from 'lucide-react';

const SOCIALS = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/donerick/', label: 'LinkedIn' },
  { icon: FaTwitter,  href: 'https://twitter.com/dtech-africa', label: 'Twitter' },
  { icon: FaYoutube,  href: 'https://www.youtube.com/channel/UCO_v6Qz3jH_Q-2Wp3rFm7aQ', label: 'YouTube' },
  { icon: FaGithub,   href: 'https://github.com/donerick', label: 'GitHub' },
];

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
      { href: '/parcours',         label: 'Parcours complets' },
      { href: '/projets',          label: 'Projets réels' },
      { href: '/certifications',   label: 'Certifications' },
      { href: '/instructeur/apply', label: 'Devenir Instructeur', highlight: true },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: '/commmunaute',   label: 'Communauté' },
      { href: '/discord', label: 'Serveur Discord' },
      { href: '/blog',    label: 'Blog Tech' },
      { href: '/faq',     label: 'Aide & FAQ' },
    ],
  },
];

const LEGAL_LINKS = [
  { href: '/legal',   label: 'Mentions Légales' },
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
                <Image src="/images/mlacademy_logo.png" alt="MLAcademy Logo" fill sizes="48px" className="object-cover" priority />
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
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title} className="space-y-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{title}</h4>
                <nav className="flex flex-col gap-4">
                  {links.map(({ href, label, highlight }) => (
                    <Link key={href} href={href} className={`${linkClass} ${highlight ? 'text-indigo-400/80' : ''}`}>
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            {/* Contact */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Contact</h4>
              <a href="mailto:contact@mlacademy.io" className={`${linkClass} flex items-center gap-2`}>
                <Mail className="w-4 h-4" /> contact@mlacademy.io
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} MLAcademy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-8">
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}