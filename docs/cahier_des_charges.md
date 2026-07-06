# Cahier des Charges
**Plateforme d'apprentissage - Data Science & Machine Learning**  
*Version 1.0 - Avril 2025*

## 1. Présentation du Projet
### 1.1 Contexte
MLAcademy est une plateforme e-learning francophone dédiée à l'apprentissage du Machine Learning et de la Data Science. Face à la montée en puissance de l'intelligence artificielle dans tous les secteurs, la demande de formation de qualité, accessible et en français, est considérable. MLAcademy comble ce manque en proposant un parcours structuré, progressif et ancré dans des projets réels.

### 1.2 Vision
Devenir la référence francophone de formation en Data Science et Machine Learning, accessible à tous - des étudiants aux professionnels en reconversion - avec une pédagogie rigoureuse, des outils interactifs et une communauté active.

### 1.3 Objectifs Principaux
- Démocratiser l'accès à la formation en ML/Data Science en langue française.
- Proposer des parcours adaptés à tous les niveaux : débutant, intermédiaire, avancé.
- Garantir un apprentissage par la pratique avec des projets concrets et des notebooks interactifs.
- Délivrer des certifications reconnues à l'issue de chaque parcours.
- Construire une communauté d'apprenants et de praticiens active.

## 2. Public Cible
| Profil | Niveau | Besoins spécifiques | Objectif |
|---|---|---|---|
| Débutant complet | Zéro | Bases Python, maths accessibles | Comprendre et pratiquer le ML |
| Développeur | Intermédiaire | Transition vers la Data Science | Reconversion ou montée en compétences |
| Étudiant universitaire | Intermédiaire | Lien théorie-pratique, maths avancées | Compléter la formation académique |
| Professionnel / Data Scientist | Avancé | Approfondissement, nouveaux outils | Certifications, projets portfolio |
| Mathématicien / Physicien | Avancé | Formalisme rigoureux, algèbre linéaire | Application des maths au ML |

## 3. Fonctionnalités Détaillées
### 3.1 Gestion des Utilisateurs & Authentification
**F-01 Inscription & Connexion**
- Inscription par email + mot de passe avec confirmation email.
- Connexion sociale : Google, GitHub, LinkedIn.
- Authentification à deux facteurs (2FA) optionnelle.
- Récupération de mot de passe par email sécurisé.
- Suppression du compte et exportation des données (conformité RGPD).

**F-02 Profil Apprenant**
- Photo de profil, biographie, liens (LinkedIn, GitHub, portfolio).
- Niveau déclaré et objectifs personnels.
- Historique complet des cours suivis et certifications obtenues.
- Tableau de bord de progression global.
- Paramètres de confidentialité (profil public/privé).

### 3.2 Catalogue de Cours
**F-03 Navigation & Recherche**
- Catalogue filtrable par : niveau, durée, thématique, notation, popularité.
- Moteur de recherche full-text instantané (Meilisearch).
- Suggestions personnalisées basées sur le profil et l'historique.
- Page de détail cours : syllabus, prérequis, instructeur, avis, aperçu gratuit.

**F-04 Structure des Cours**
- **Parcours :** ensemble cohérent de modules (ex: Parcours Data Science Complet).
- **Module :** unité thématique regroupant plusieurs leçons.
- **Leçon :** unité atomique (vidéo + texte + exercice + quiz).
- **Projet :** application pratique clôturant chaque module.

### 3.3 Expérience d'Apprentissage
**F-05 Lecteur Vidéo**
- Lecture adaptative selon la bande passante (HLS, Mux.io).
- Vitesse de lecture réglable : 0.75x à 2x.
- Sous-titres générés automatiquement (FR + EN).
- Reprise automatique à la dernière position.
- Mode hors-ligne : téléchargement de leçons (abonnés premium).
- Notes de cours synchronisées avec le timecode de la vidéo.

**F-06 Notebook Interactif (Python in-browser)**
- Éditeur de code Monaco Editor (identique à VS Code).
- Exécution Python en sandbox isolée via FastAPI + Judge0.
- Bibliothèques disponibles : NumPy, Pandas, Matplotlib, Scikit-learn, Seaborn.
- Enregistrement automatique du code et des résultats.
- Affichage inline des graphiques et visualisations.
- Mode correction : comparaison avec la solution de l'instructeur.

**F-07 Quiz & Évaluations**
- QCM, vrai/faux, réponse courte, glisser-déposer de code.
- Feedback instantané avec explication de la bonne réponse.
- Tentatives illimitées avec mélange aléatoire des questions.
- Score minimal requis pour valider la leçon (paramétrable).
- Examen de certification : conditions strictes (durée limitée, 1 tentative/semaine).

### 3.4 Progression & Certification
**F-08 Suivi de Progression**
- Barre de progression par leçon, module et parcours.
- Streak quotidien (nombre de jours consécutifs d'apprentissage).
- Temps total d'apprentissage par cours et global.
- Rappels programmables par email et notification push.

**F-09 Certification**
- Certificat de complétion pour chaque cours finalisé.
- Certificat de parcours après validation de tous les modules + projet final.
- Certificat PDF téléchargeable avec QR code de vérification.
- Lien de partage LinkedIn intégré.
- Registre public de vérification des certificats (URL unique).

### 3.5 Gamification & Engagement
**F-10 Système de Points & Badges**
- Points XP gagnés à chaque leçon complétée, quiz réussi, projet soumis.
- Badges thématiques : "Beginner", "Ninja Coding", "Master of Code".
- Classement hebdomadaire/mensuel entre apprenants (opt-in).
- Défis hebdomadaires : mini-projets chronométrés avec bonus XP.

### 3.6 Communauté & Support
**F-11 Forum de Discussion**
- Forum par cours et par leçon avec fil de discussion structuré.
- Système de votes positifs/négatifs sur les réponses.
- Mention @instructeur pour obtenir une réponse prioritaire.
- Réponses formatées avec coloration syntaxique du code.

**F-12 Sessions Live (future roadmap)**
- Sessions Q&R en direct avec les instructeurs (Zoom / Daily.co intégré).
- Replay disponible dans les 24h.

### 3.7 Monétisation & Paiements
**F-13 Modèle Freemium**

| Fonctionnalité | Gratuit | Premium (9,99€/mois) | Pro (19,99€/mois) |
|---|---|---|---|
| Accès aux leçons de niveau 1 | ✅ Oui | ✅ Oui | ✅ Oui |
| Accès complet à tous les cours | ❌ Non | ✅ Oui | ✅ Oui |
| Notebooks interactifs | Limité | ✅ Illimité | ✅ Illimité |
| Téléchargement hors-ligne | ❌ Non | ✅ Oui | ✅ Oui |
| Certifications | ❌ Non | ✅ Oui | ✅ Oui |
| Sessions live | ❌ Non | ❌ Non | ✅ Oui |
| Projets guidés avancés | ❌ Non | ❌ Non | ✅ Oui |
| Support prioritaire | ❌ Non | ❌ Non | ✅ Oui |

- Paiement sécurisé via Stripe (carte, virement, Mobile Money Afrique).
- Facturation mensuelle ou annuelle (2 mois offerts).
- Système de bons de réduction et codes promo.
- Remboursement sous 14 jours (politique satisfait ou remboursé).

### 3.8 Interface d'Administration
**F-14 Tableau de Bord Admin**
- Statistiques globales : apprenants actifs, CA, cours les plus suivis, taux de complétion.
- Gestion des utilisateurs : recherche, suspension, modification des accès.
- Gestion des cours : création, modification, publication, archivage.
- Gestion des instructeurs : profils, cours publiés, revenus générés.

**F-15 Création de Cours (CMS)**
- Éditeur WYSIWYG pour le contenu texte des leçons.
- Upload et encodage vidéo automatique (Mux).
- Constructeur de quiz par glisser-déposer.
- Prévisualisation de la leçon avant publication.
- Gestion des versions (draft / publié / archivé).

### 3.9 Système de Notifications
- Notifications in-app : nouvelles leçons, badges obtenus, réponses au forum.
- Emails transactionnels : bienvenue, rappels, certificats, factures (Resend).
- Notifications push (PWA) : rappels d'apprentissage quotidiens.
- Préférences de notification entièrement configurables par l'utilisateur.

### 3.10 Accessibilité & Internationalisation
- Conformité WCAG 2.1 niveau AA (contraste, navigation clavier, ARIA).
- Design responsive : mobile, tablette, desktop.
- Mode clair / sombre.
- Lecture des sous-titres pour malentendants.
- Interface 100% en français (internationalisation prête pour EN/ES).

## 4. Exigences Non-Fonctionnelles
### 4.1 Performance
- Temps de chargement initial < 2 secondes (LCP) sur connexion 4G.
- Score Lighthouse > 90 (Performance, Accessibilité, SEO).
- Démarrage vidéo < 1 seconde grâce au CDN Cloudflare.
- API : temps de réponse médian < 150ms, P99 < 500ms.

### 4.2 Disponibilité & Scalabilité
- SLA : 99,9% de disponibilité (< 8h de downtime/an).
- Architecture stateless permettant le scaling horizontal.
- Support de 10 000 utilisateurs simultanés sans dégradation.

### 4.3 Sécurité
- Chiffrement TLS 1.3 pour toutes les communications.
- Mots de passe hashés avec bcrypt (salage automatique).
- Protection CSRF, XSS, injection SQL par défaut (Prisma ORM).
- Rate limiting sur toutes les routes sensibles (authentification, API).
- Audit logs pour les actions administratives.

### 4.4 Conformité RGPD
- Consentement explicite aux cookies et au traitement des données.
- Droit à l'oubli : suppression complète du compte sur demande.
- Exportation des données personnelles (format JSON/CSV).
- Hébergement des données en Union Européenne.
