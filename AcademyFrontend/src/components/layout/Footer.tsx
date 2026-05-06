import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link href="/" className="logo-link">
            <Image 
              src="/mlacademy_logo.png" 
              alt="MLAcademy Logo" 
              width={100} 
              height={80} 
              className="logo-img-footer"
            />
          </Link>
          <p className="footer-desc">
            La plateforme francophone de référence pour l'apprentissage du Machine Learning et de la Data Science.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Apprendre</h4>
            <Link href="/parcours">Parcours complets</Link>
            <Link href="/projets">Projets pratiques</Link>
            <Link href="/certifications">Certifications</Link>
          </div>
          <div className="footer-col">
            <h4>Communauté</h4>
            <Link href="/forum">Forum</Link>
            <Link href="/discord">Serveur Discord</Link>
            <Link href="/blog">Blog technique</Link>
          </div>
          <div className="footer-col">
            <h4>Légal</h4>
            <Link href="/cgu">Conditions d'utilisation</Link>
            <Link href="/confidentialite">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} MLAcademy. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
