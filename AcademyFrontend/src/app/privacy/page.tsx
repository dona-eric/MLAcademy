export const metadata = {
  title: "Politique de Confidentialité - MLAcademy",
  description: "Comment nous traitons vos données personnelles sur MLAcademy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Politique de <span className="text-[var(--brand-500)]">Confidentialité</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="card p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--brand-500)]">
          <p>
            Chez MLAcademy, nous accordons une importance primordiale à la protection de vos données personnelles. 
            Cette politique de confidentialité vous explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
          </p>

          <h2>1. Données collectées</h2>
          <p>Nous collectons les données suivantes lorsque vous utilisez notre plateforme :</p>
          <ul>
            <li><strong>Informations d'identification :</strong> Nom, prénom, adresse e-mail.</li>
            <li><strong>Données de profil :</strong> Titre professionnel, photo de profil, liens sociaux (LinkedIn, GitHub).</li>
            <li><strong>Données d'apprentissage :</strong> Progression dans les cours, scores aux quiz, projets soumis et certificats obtenus.</li>
            <li><strong>Données de communication :</strong> Messages échangés dans la section Communauté.</li>
          </ul>

          <h2>2. Utilisation de vos données</h2>
          <p>Vos données sont utilisées exclusivement pour les finalités suivantes :</p>
          <ul>
            <li>Création et gestion de votre compte étudiant ou instructeur.</li>
            <li>Suivi de votre progression pédagogique et émission de vos certificats.</li>
            <li>Mise en relation avec des recruteurs (uniquement si vous postulez à une offre).</li>
            <li>Envoi de notifications importantes ou d'emails liés à la plateforme (newsletter, alertes).</li>
          </ul>

          <h2>3. Partage des données</h2>
          <p>
            Nous ne vendons <strong>jamais</strong> vos données personnelles à des tiers. 
            Vos données peuvent être partagées avec des partenaires de confiance uniquement dans le cadre de la prestation de nos services (hébergement, envoi d'emails transactionnels).
          </p>

          <h2>4. Sécurité</h2>
          <p>
            Vos données sont stockées de manière sécurisée sur des serveurs protégés (Supabase). 
            Les mots de passe sont hachés cryptographiquement et ne sont jamais stockés en clair.
          </p>

          <h2>5. Vos droits</h2>
          <p>
            Conformément au RGPD et aux lois de protection des données applicables, vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d'accès et de rectification de vos données.</li>
            <li>Droit à la suppression (droit à l'oubli).</li>
            <li>Droit de retirer votre consentement pour la newsletter à tout moment.</li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : <strong>contact@mlacademy.io</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
