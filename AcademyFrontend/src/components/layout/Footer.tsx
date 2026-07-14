import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import Newsletter from '../marketing/Newsletter';

const SOCIALS = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/dtech-africa', label: 'LinkedIn' },
  { icon: FaTwitter,  href: 'https://twitter.com/dtech-africa', label: 'Twitter' },
  { icon: FaYoutube,  href: 'https://www.youtube.com/channel/UCO_v6Qz3jH_Q-2Wp3rFm7aQ', label: 'YouTube' },
  { icon: FaGithub,   href: 'https://github.com/dtech-afrik', label: 'GitHub' },
];

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
      { href: '/parcours',         label: 'Parcours complets' },
      { href: '/certifications',   label: 'Certifications' },
      { href: '/devenir-instructeur', label: 'Devenir Instructeur' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: '/communaute', label: 'Communauté' },
      { href: '/blog',       label: 'Blog Tech' },
      { href: '/faq',        label: 'Aide & FAQ' },
    ],
  },
];

const LEGAL_LINKS = [
  { href: '/legal',   label: 'Mentions Légales' },
  { href: '/privacy', label: 'Confidentialité' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 -mt-8">
          <Newsletter />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--border-default)] shadow-sm group-hover:scale-105 transition-transform">
                <Image src="/images/mlacademy_logo_final.png" alt="MLAcademy Logo" fill sizes="50px" className="object-cover" priority />
              </div>
              <span className="text-xl font-extrabold text-[var(--brand-500)] tracking-tight">MLAcademy</span>
            </Link>

            <p className="text-[var(--text-primary)] text-sm leading-relaxed max-w-sm">
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
                </Link>
              ))}
            </div>
          </div>

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
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            {/* Contact */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Contact</h4>
              <a href="mailto:dtech.afrik@gmail.com" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> contact@mlacademy.io
              </a>
            </div>
          </div>
        </div>

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
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}