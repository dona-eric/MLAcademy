# Check-up & Roadmap Global : MLAcademy

## 🎯 1. Bilan des Réalisations (Ce qui est fait à 100%)

### Authentification & Sécurité (Core)
- [x] **Système de connexion JWT complet** (Custom User, Tokens, Refresh).
- [x] **Connexion Sociale (OAuth)** : GitHub & Google (Callback géré avec génération de JWT).
- [x] **Inscription & Onboarding** : Formulaire multi-étapes (Step 1 à 8) pour les étudiants, capturant les informations métiers (Niveau, Objectif, Financement).
- [x] **Sécurité 2FA (Google Authenticator)** :
  - Génération de QR Code au premier login.
  - Exigence du code à 6 chiffres aux connexions suivantes.
  - Déconnexion automatique (assombrissement/verrouillage) après 1h d'inactivité.
- [x] **Mot de Passe Oublié** : Flux par lien magique envoyé par email (`/password-reset` & `/password-reset/confirm`).

### Rôles & Espaces
- [x] **Logique de Routage Sécurisée** : Centralisation des redirections selon le rôle (`getRedirectPath`).
- [x] **Espace Administrateur (`/admin/dashboard`)** :
  - Statistiques en temps réel (chiffres d'affaires, utilisateurs).
  - Gestion des Candidatures Instructeurs avec approbation/rejet et envoi d'emails réels avec justification.
  - Audit Log des actions administratives (Traçabilité totale).
- [x] **Espace Étudiant (`/dashboard`)** :
  - Design premium, minimaliste et responsif (Dark Mode / Glassmorphism).
  - Affichage conditionnel (Profil public/privé, réseaux sociaux limités aux étudiants/instructeurs).

### Backend (Django DRF)
- [x] **Modèles de Données Solides** : `CustomUser`, `StudentProfile`, `InstructorApplication`, `AuditLog`, `Course`, `Enrollment`.
- [x] **API Endpoints Fonctionnels** : Profil, Sécurité, Auth, Admin Management.

---

## 🚧 2. Ce qui reste à faire (Roadmap & Améliorations)

Nous diviserons la suite du projet en **phases strictes**. Conformément à tes nouvelles instructions, avant de commencer une phase, un plan d'action détaillé te sera soumis pour validation.

### Phase 1 : Espace Formateur & Création de Contenu (Priorité Haute)
- **Objectif** : Permettre aux instructeurs approuvés de construire leurs cours.
- **Tâches** :
  1. Construire l'interface `/instructor` (Dashboard Formateur).
  2. Implémenter le builder de cours (Création de modules, chapitres, upload vidéos/documents).
  3. Formulaire de conception de Quiz.

### Phase 2 : Player Vidéo & Apprentissage (Le cœur du produit)
- **Objectif** : L'interface où l'étudiant consomme le cours.
- **Tâches** :
  1. Développer l'interface du "Course Player" (Barre latérale de progression, lecteur vidéo principal).
  2. Intégrer le système de notes (Notion-like) pris par l'étudiant pendant la vidéo.
  3. Implémenter le passage des Quiz interactifs.

### Phase 3 : Sandbox Python & Exécution de Code
- **Objectif** : Exercices de code interactifs directement dans le navigateur.
- **Tâches** :
  1. Intégrer Judge0 (qui est déjà dockerisé) au frontend.
  2. Ajouter l'éditeur de code intégré (type Monaco Editor / VS Code) dans le Player.

### Phase 4 : Catalogue de Cours & Paiement (Stripe)
- **Objectif** : Monétisation et découverte.
- **Tâches** :
  1. Page de catalogue (`/parcours`) avec filtres avancés (Machine Learning, Data Science).
  2. Checkout & Intégration de l'API Stripe pour le paiement (ou le financement).

---

## 💡 3. Note sur les Emails (SMTP)
Actuellement, le backend utilise la fonction `send_mail` native de Django. En environnement de développement, elle est souvent configurée pour afficher les emails dans la console (`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`) ou utiliser un serveur local factice.
**Ceci ne posera aucun problème en production.** Lors du déploiement, il suffira de remplacer les variables `.env` par les identifiants d'un vrai service (SendGrid, AWS SES, Mailgun, ou même Gmail SMTP) sans avoir à toucher une seule ligne de code backend. La transition sera transparente.
