export const metadata = {
  title: "Mentions Légales - MLAcademy",
  description: "Mentions légales de la plateforme MLAcademy",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Mentions <span className="text-[var(--brand-500)]">Légales</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="card p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--brand-500)]">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>MLAcademy</strong> (accessible à l'adresse <em>mlacademie.vercel.app</em>) est édité par :
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> DTech Africa (à remplacer)</li>
            <li><strong>Forme juridique :</strong> SAS / SARL (à remplacer)</li>
            <li><strong>Capital social :</strong> XXXXX euros</li>
            <li><strong>Siège social :</strong> 123 Rue de l'Innovation, Dakar, Sénégal (à remplacer)</li>
            <li><strong>Email de contact :</strong> contact@mlacademy.io</li>
            <li><strong>Directeur de la publication :</strong> [Votre Nom]</li>
          </ul>

          <h2>2. Hébergement</h2>
          <p>
            L'hébergement du site est assuré par les prestataires suivants :
          </p>
          <ul>
            <li><strong>Frontend :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</li>
            <li><strong>Backend & API :</strong> Render (Render Networks, Inc.), San Francisco, CA, USA.</li>
            <li><strong>Base de données :</strong> Supabase, San Francisco, CA, USA.</li>
          </ul>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments figurant sur le site MLAcademy (textes, graphismes, logos, vidéos, images, etc.) 
            sont la propriété exclusive de MLAcademy ou de ses partenaires. Toute reproduction, représentation, 
            modification ou adaptation totale ou partielle de ces éléments, sans l'accord écrit préalable, est strictement interdite.
          </p>

          <h2>4. Collecte des données personnelles</h2>
          <p>
            Conformément aux lois en vigueur, MLAcademy s'engage à protéger la vie privée de ses utilisateurs. 
            Pour plus de détails sur la façon dont nous traitons vos données, veuillez consulter notre <a href="/privacy">Politique de confidentialité</a>.
          </p>

          <h2>5. Limitation de responsabilité</h2>
          <p>
            MLAcademy s'efforce de fournir des informations aussi précises que possible sur la plateforme. 
            Toutefois, l'éditeur ne pourra être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour des contenus.
          </p>
        </div>
      </div>
    </div>
  );
}
