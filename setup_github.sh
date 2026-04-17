#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════
#  MLAcademy — Script de configuration GitHub
#  Usage : ./setup_github.sh GITHUB_USERNAME
# ════════════════════════════════════════════════════════════

set -e

USERNAME="${1:-TON_USERNAME}"
REPO="MLAcademy"
REPO_FULL="$USERNAME/$REPO"

echo "🚀 Configuration du repo GitHub MLAcademy"
echo "   Repo cible : https://github.com/$REPO_FULL"
echo ""

# ── 1. Initialiser Git ──────────────────────────────────────
echo "📁 Initialisation Git..."
git init
git add .
git commit -m "chore: initialisation du projet MLAcademy

- Structure monorepo (frontend, backend-api, backend-python)
- Configuration Next.js 14 + TypeScript + Tailwind
- Schéma Prisma complet (users, courses, progress, certificates)
- FastAPI Python pour l'exécution de code sandbox
- CI/CD GitHub Actions (lint, test, deploy)
- Templates d'issues et de PR"

# ── 2. Créer le repo GitHub ─────────────────────────────────
echo "🐙 Création du repo GitHub..."
gh repo create "$REPO" \
  --private \
  --description "La référence francophone en Data Science et Machine Learning" \
  --homepage "https://mlacademy.fr" \
  --push \
  --source .

# ── 3. Paramètres du repo ───────────────────────────────────
echo "⚙️  Configuration du repo..."
gh repo edit "$REPO_FULL" \
  --enable-issues \
  --enable-projects \
  --delete-branch-on-merge

# ── 4. Labels ───────────────────────────────────────────────
echo "🏷️  Création des labels..."
gh label create "frontend"      --color "7057FF" --description "Interface utilisateur"          --repo "$REPO_FULL" 2>/dev/null || true
gh label create "backend"       --color "0075CA" --description "API et logique serveur"          --repo "$REPO_FULL" 2>/dev/null || true
gh label create "database"      --color "E4E669" --description "Base de données et migrations"   --repo "$REPO_FULL" 2>/dev/null || true
gh label create "python"        --color "3776AB" --description "Service d'exécution Python"      --repo "$REPO_FULL" 2>/dev/null || true
gh label create "auth"          --color "D93F0B" --description "Authentification et sécurité"    --repo "$REPO_FULL" 2>/dev/null || true
gh label create "payments"      --color "0E8A16" --description "Stripe et paiements"             --repo "$REPO_FULL" 2>/dev/null || true
gh label create "devops"        --color "BFD4F2" --description "CI/CD et infrastructure"         --repo "$REPO_FULL" 2>/dev/null || true
gh label create "phase-1-mvp"   --color "1D76DB" --description "Phase 1 — MVP"                   --repo "$REPO_FULL" 2>/dev/null || true
gh label create "phase-2"       --color "5319E7" --description "Phase 2 — Enrichissement"        --repo "$REPO_FULL" 2>/dev/null || true
gh label create "phase-3"       --color "006B75" --description "Phase 3 — Scale"                 --repo "$REPO_FULL" 2>/dev/null || true
gh label create "blocked"       --color "B60205" --description "Bloquée par une dépendance"      --repo "$REPO_FULL" 2>/dev/null || true
gh label create "in-progress"   --color "FBCA04" --description "En cours de développement"       --repo "$REPO_FULL" 2>/dev/null || true

# ── 5. Milestones ───────────────────────────────────────────
echo "🎯 Création des milestones..."

M1=$(gh api repos/"$REPO_FULL"/milestones \
  -X POST \
  -f title="Phase 1 — MVP" \
  -f description="Authentification, catalogue, lecteur vidéo, notebooks, quiz, paiement Stripe" \
  -f due_on="$(date -d '+90 days' --utc +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -v+90d -u +%Y-%m-%dT%H:%M:%SZ)" \
  --jq '.number')

M2=$(gh api repos/"$REPO_FULL"/milestones \
  -X POST \
  -f title="Phase 2 — Enrichissement" \
  -f description="Certification, gamification, forum, notifications, mobile" \
  -f due_on="$(date -d '+180 days' --utc +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -v+180d -u +%Y-%m-%dT%H:%M:%SZ)" \
  --jq '.number')

M3=$(gh api repos/"$REPO_FULL"/milestones \
  -X POST \
  -f title="Phase 3 — Communauté et Scale" \
  -f description="Sessions live, programme instructeurs, recommandations ML, multilingue" \
  -f due_on="$(date -d '+365 days' --utc +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -v+365d -u +%Y-%m-%dT%H:%M:%SZ)" \
  --jq '.number')

echo "   Milestones : #$M1, #$M2, #$M3"

# ── 6. Issues Phase 1 — MVP ─────────────────────────────────
echo "📝 Création des issues Phase 1 — MVP..."

create_issue() {
  local title="$1" body="$2" labels="$3" milestone="$4"
  gh issue create \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --milestone "$milestone" \
    --repo "$REPO_FULL"
}

# Infrastructure & DevOps
create_issue \
"[DEVOPS] Configurer le monorepo Turborepo + pnpm workspaces" \
"## Objectif
Mettre en place la structure de base du monorepo avec Turborepo.

## Tâches
- [ ] Configurer pnpm workspaces (frontend, backend-api, backend-python, packages/shared)
- [ ] Configurer turbo.json avec les pipelines (dev, build, lint, test)
- [ ] Installer et configurer TypeScript en mode strict pour tous les packages
- [ ] Configurer Prettier + ESLint partagés
- [ ] Vérifier que \`pnpm dev\` lance simultanément tous les services

## Critères d'acceptation
- \`pnpm dev\` lance frontend (port 3000), backend-api (port 3001), backend-python (port 8000)
- \`pnpm build\` compile sans erreur
- \`pnpm lint\` passe sans warning" \
"devops,phase-1-mvp" "$M1"

create_issue \
"[DEVOPS] Configurer le pipeline CI/CD GitHub Actions" \
"## Objectif
Automatiser les tests et déploiements via GitHub Actions.

## Tâches
- [ ] Workflow CI : lint + type-check + tests sur chaque PR
- [ ] Workflow Deploy : déploiement auto sur main → Vercel (frontend) + Railway (Python)
- [ ] Configurer les secrets GitHub (CLERK, STRIPE, VERCEL, RAILWAY, DATABASE_URL...)
- [ ] Ajouter les badges de statut dans le README
- [ ] Configurer la protection de la branche main (PR obligatoire + CI verte)

## Critères d'acceptation
- Toute PR déclenche le CI automatiquement
- Un push sur main déploie en production sans intervention manuelle" \
"devops,phase-1-mvp" "$M1"

create_issue \
"[DEVOPS] Configurer Docker Compose pour le développement local" \
"## Objectif
Permettre à n'importe quel développeur de lancer l'environnement complet en une commande.

## Tâches
- [ ] docker-compose.yml avec : PostgreSQL 16, Redis, Meilisearch
- [ ] Script d'initialisation de la base de données (migrations Prisma + seed)
- [ ] Variables d'environnement d'exemple documentées
- [ ] Script \`make setup\` pour l'onboarding d'un nouveau développeur

## Critères d'acceptation
- \`docker compose up -d && pnpm dev\` suffit pour avoir un environnement complet fonctionnel" \
"devops,phase-1-mvp" "$M1"

# Base de données
create_issue \
"[DATABASE] Implémenter le schéma Prisma et les migrations initiales" \
"## Objectif
Mettre en place la base de données complète avec Prisma ORM.

## Tâches
- [ ] Finaliser le schéma Prisma (users, courses, modules, lessons, enrollments, progress, certificates, badges)
- [ ] Générer et appliquer la migration initiale
- [ ] Créer le script de seed avec : 3 utilisateurs test, 2 cours pilotes, 10 leçons
- [ ] Configurer les index de performance sur les colonnes fréquemment requêtées
- [ ] Écrire les tests d'intégrité du schéma

## Modèles à implémenter
User, Course, Module, Lesson, Enrollment, Progress, Certificate, Badge, UserBadge, CourseTag

## Critères d'acceptation
- \`pnpm db:migrate\` s'exécute sans erreur
- \`pnpm db:seed\` peuple la base avec des données de test cohérentes" \
"database,backend,phase-1-mvp" "$M1"

# Authentification
create_issue \
"[AUTH] Intégrer Clerk — inscription, connexion, profils" \
"## Objectif
Implémenter l'authentification complète via Clerk.

## Tâches
- [ ] Configurer Clerk dans Next.js (ClerkProvider, middleware)
- [ ] Pages /sign-in et /sign-up avec le composant Clerk
- [ ] Webhook Clerk → synchronisation user vers PostgreSQL (via Prisma)
- [ ] Route API protégée : vérification du token Clerk côté serveur
- [ ] Middleware de protection des routes authentifiées (/dashboard, /courses/*/learn)
- [ ] Page profil utilisateur : avatar, bio, liens sociaux

## Critères d'acceptation
- Un utilisateur peut s'inscrire, se connecter et se déconnecter
- Son profil est synchronisé en base de données automatiquement
- Les routes protégées redirigent vers /sign-in si non authentifié" \
"auth,frontend,backend,phase-1-mvp" "$M1"

# Frontend — Pages principales
create_issue \
"[FRONTEND] Développer la page d'accueil (landing page)" \
"## Objectif
Créer une landing page convaincante qui présente MLAcademy et convertit les visiteurs.

## Sections à implémenter
- [ ] Header / Navigation responsive (logo, liens, CTA connexion)
- [ ] Hero section : titre accrocheur + CTA principal + illustration
- [ ] Section statistiques : nombre d'apprenants, cours, heures de contenu
- [ ] Aperçu du catalogue (3 cours en vedette)
- [ ] Section témoignages (mockdata pour le MVP)
- [ ] Section parcours disponibles
- [ ] FAQ accordéon
- [ ] Footer complet (liens, réseaux sociaux, mentions légales)

## Critères d'acceptation
- Score Lighthouse Performance > 90
- Responsive mobile/tablette/desktop
- Thème clair et sombre fonctionnel" \
"frontend,phase-1-mvp" "$M1"

create_issue \
"[FRONTEND] Développer le catalogue de cours avec filtres et recherche" \
"## Objectif
Permettre aux apprenants de trouver facilement un cours adapté à leur niveau.

## Tâches
- [ ] Page /courses : grille de cards de cours
- [ ] Filtres : niveau (débutant/intermédiaire/avancé), durée, thématique
- [ ] Barre de recherche connectée à Meilisearch
- [ ] Tri : popularité, date, note, durée
- [ ] Page de détail /courses/[slug] : syllabus complet, instructeur, avis, CTA inscription
- [ ] Breadcrumb et métadonnées SEO pour chaque cours
- [ ] Skeleton loading et états vides gérés

## Critères d'acceptation
- La recherche répond en < 200ms
- La page de détail est indexable par les moteurs de recherche (SSR)" \
"frontend,phase-1-mvp" "$M1"

create_issue \
"[FRONTEND] Développer le lecteur de cours (player + progression)" \
"## Objectif
Créer l'interface principale d'apprentissage — la page la plus importante de la plateforme.

## Tâches
- [ ] Layout 3 colonnes : sidebar syllabus / lecteur principal / notes
- [ ] Lecteur vidéo Mux avec reprise automatique et sous-titres
- [ ] Contrôles vitesse de lecture (0.75x → 2x)
- [ ] Marquage leçon comme complétée (bouton + auto au bout de 90% de la vidéo)
- [ ] Navigation entre leçons (précédent/suivant) avec état du syllabus
- [ ] Système de notes personnelles synchronisées avec le timecode
- [ ] Barre de progression du module
- [ ] Mode plein écran

## Critères d'acceptation
- La progression est sauvegardée en temps réel (debounce 3s)
- La reprise automatique fonctionne entre sessions
- Responsive jusqu'à 768px de largeur" \
"frontend,phase-1-mvp" "$M1"

create_issue \
"[FRONTEND] Développer le tableau de bord apprenant" \
"## Objectif
Donner à l'apprenant une vue claire de sa progression et de ses objectifs.

## Sections
- [ ] Cours en cours avec progression (%)
- [ ] Streak quotidien et points XP
- [ ] Prochaine leçon recommandée (CTA principal)
- [ ] Certifications obtenues
- [ ] Activité récente (timeline)
- [ ] Stats globales : heures totales, cours complétés, badges

## Critères d'acceptation
- Les données sont chargées en < 500ms (cache Redis)
- Le dashboard est accessible uniquement aux utilisateurs connectés" \
"frontend,phase-1-mvp" "$M1"

# Notebooks interactifs
create_issue \
"[PYTHON] Développer le service d'exécution de code Python (sandbox)" \
"## Objectif
Permettre l'exécution sécurisée de code Python directement dans le navigateur.

## Tâches
- [ ] API FastAPI avec endpoint POST /execute
- [ ] Sandbox isolée : timeout 10s, mémoire limitée 256MB, pas d'accès réseau
- [ ] Support des bibliothèques : NumPy, Pandas, Matplotlib, Scikit-learn, Seaborn
- [ ] Capture des outputs texte (stdout/stderr)
- [ ] Capture et encodage base64 des graphiques Matplotlib/Plotly
- [ ] Rate limiting : max 20 exécutions/minute/utilisateur
- [ ] Tests unitaires pour les cas limites (timeout, boucles infinies, erreurs)

## Sécurité
- Bloquer les imports dangereux (os.system, subprocess, socket...)
- Exécution dans un container Docker isolé
- Pas d'accès au filesystem hôte

## Critères d'acceptation
- Exécution d'un script NumPy basique en < 2s
- Les graphiques s'affichent inline dans le notebook
- Un code malveillant est bloqué et retourne une erreur propre" \
"python,backend,phase-1-mvp" "$M1"

create_issue \
"[FRONTEND] Intégrer Monaco Editor — notebook interactif in-browser" \
"## Objectif
Créer l'expérience notebook dans les leçons de type 'notebook'.

## Tâches
- [ ] Composant MonacoEditor configuré pour Python (coloration, autocomplétion)
- [ ] Bouton Exécuter → appel API Python → affichage résultat
- [ ] Affichage inline des graphiques (images base64)
- [ ] Affichage coloré stdout (blanc) / stderr (rouge)
- [ ] Indicateur de chargement pendant l'exécution
- [ ] Bouton Réinitialiser (retour au code de départ)
- [ ] Bouton Voir la solution (après 3 tentatives ou sur demande)
- [ ] Sauvegarde automatique du code de l'apprenant (localStorage + DB)

## Critères d'acceptation
- L'exécution est déclenchée par Ctrl+Enter ou le bouton
- Les erreurs Python sont affichées avec le numéro de ligne
- Le code de l'apprenant est restauré à la reprise de la leçon" \
"frontend,phase-1-mvp" "$M1"

# Quiz
create_issue \
"[FRONTEND] Système de quiz — QCM, feedback et score" \
"## Objectif
Implémenter le système d'évaluation des leçons de type quiz.

## Tâches
- [ ] Types de questions : QCM (1 ou N réponses), Vrai/Faux, Code à compléter
- [ ] Mélange aléatoire des questions et des choix
- [ ] Feedback immédiat après chaque réponse (bonne/mauvaise + explication)
- [ ] Score final avec pourcentage et barre visuelle
- [ ] Seuil de validation : 75% minimum pour valider la leçon
- [ ] Tentatives illimitées avec délai de 10min entre chaque
- [ ] Enregistrement du meilleur score en base de données

## Critères d'acceptation
- Un quiz de 10 questions s'affiche et se soumet sans bug
- Le score est enregistré et visible dans le dashboard
- Le blocage par seuil fonctionne correctement" \
"frontend,backend,phase-1-mvp" "$M1"

# API tRPC
create_issue \
"[BACKEND] Implémenter les routers tRPC — courses, users, progress" \
"## Objectif
Créer l'API typesafe avec tRPC qui alimente le frontend.

## Routers à implémenter
- [ ] userRouter : getProfile, updateProfile, getDashboard
- [ ] courseRouter : list, getBySlug, enroll, getCurriculum
- [ ] progressRouter : markComplete, getProgress, getCourseProgress
- [ ] searchRouter : searchCourses (connecté à Meilisearch)
- [ ] certRouter : generate, verify, list

## Middleware
- [ ] Middleware d'authentification (vérification token Clerk)
- [ ] Middleware de vérification d'accès (plan premium/pro)
- [ ] Rate limiting sur les routes sensibles

## Critères d'acceptation
- Toutes les routes sont typesafes (pas de 'any')
- Les erreurs retournent des codes HTTP appropriés
- Les routes protégées retournent 401 sans token valide" \
"backend,phase-1-mvp" "$M1"

# Paiements
create_issue \
"[PAYMENTS] Intégrer Stripe — abonnements premium et pro" \
"## Objectif
Permettre aux apprenants de souscrire aux plans payants.

## Tâches
- [ ] Créer les produits et prix dans Stripe Dashboard (Premium 9,99€/mois, Pro 19,99€/mois)
- [ ] Page /pricing avec comparaison des plans
- [ ] Stripe Checkout intégré (redirection vers Stripe)
- [ ] Webhook Stripe : \`customer.subscription.created/updated/deleted\` → mise à jour du plan en DB
- [ ] Page /billing : plan actuel, date de renouvellement, historique factures
- [ ] Gestion de l'annulation (immédiate et fin de période)
- [ ] Emails transactionnels : confirmation d'abonnement, échec de paiement

## Critères d'acceptation
- Un utilisateur peut s'abonner et son plan est mis à jour instantanément
- La résiliation fonctionne et l'accès est maintenu jusqu'à la fin de la période" \
"payments,backend,frontend,phase-1-mvp" "$M1"

# ── Issues Phase 2 ───────────────────────────────────────────
echo "📝 Création des issues Phase 2..."

create_issue \
"[FEAT] Système de certification avec QR code de vérification" \
"## Objectif
Délivrer des certificats professionnels vérifiables à l'issue de chaque cours.

## Tâches
- [ ] Génération automatique du certificat PDF (React PDF ou puppeteer)
- [ ] Template de certificat avec nom, cours, date, QR code
- [ ] Page de vérification publique /verify/[code]
- [ ] Bouton de partage LinkedIn (Open Graph configuré)
- [ ] Email automatique avec le certificat en PJ
- [ ] Registre public des certificats

## Critères d'acceptation
- Le PDF est généré en < 3s
- Le QR code renvoie vers la page de vérification publique
- Le partage LinkedIn affiche le certificat correctement" \
"frontend,backend,phase-2" "$M2"

create_issue \
"[FEAT] Système de gamification — XP, badges, classements" \
"## Objectif
Augmenter l'engagement et la rétention via la gamification.

## Tâches
- [ ] Système de points XP : +10 leçon, +25 quiz 100%, +100 cours complété, +200 projet
- [ ] 15 badges à définir et implémenter (Premier pas, Assidu, Ninja Pandas...)
- [ ] Streak quotidien avec notification de rappel
- [ ] Classement hebdomadaire et mensuel (opt-in)
- [ ] Page profil public avec badges et stats
- [ ] Notification in-app lors de l'obtention d'un badge

## Critères d'acceptation
- Les XP sont attribués automatiquement et immédiatement
- Les badges s'affichent sur le profil de l'apprenant
- Le classement se met à jour toutes les heures" \
"frontend,backend,phase-2" "$M2"

create_issue \
"[FEAT] Forum de discussion par cours et par leçon" \
"## Objectif
Permettre aux apprenants de poser des questions et d'entraide.

## Tâches
- [ ] Forum intégré sous chaque leçon
- [ ] Fil de discussion threaded (question + réponses)
- [ ] Éditeur riche avec coloration syntaxique du code
- [ ] Système de votes (upvote/downvote)
- [ ] Mention @instructeur pour réponse prioritaire
- [ ] Notification par email lors d'une réponse à sa question
- [ ] Modération : signalement + masquage par les admins

## Critères d'acceptation
- Un apprenant peut poster une question avec du code formaté
- L'instructeur reçoit une notification par email lors d'une mention
- Les réponses les mieux votées remontent automatiquement" \
"frontend,backend,phase-2" "$M2"

create_issue \
"[FEAT] Notifications push et emails transactionnels" \
"## Objectif
Relancer l'engagement via des notifications personnalisées et utiles.

## Tâches
- [ ] Emails via Resend : bienvenue, rappel hebdomadaire, badge obtenu, certificat
- [ ] Templates React Email pour tous les emails
- [ ] Notifications push PWA : rappel quotidien d'apprentissage
- [ ] Centre de préférences : l'utilisateur choisit quelles notifs recevoir
- [ ] BullMQ pour les jobs asynchrones (envoi différé, retry automatique)

## Critères d'acceptation
- Tous les emails arrivent en boîte de réception (pas en spam)
- L'utilisateur peut se désabonner de chaque type de notification séparément" \
"backend,phase-2" "$M2"

create_issue \
"[FEAT] Application mobile React Native" \
"## Objectif
Rendre MLAcademy accessible sur iOS et Android.

## Tâches
- [ ] Initialiser le projet Expo (React Native)
- [ ] Navigation : BottomTab + Stack
- [ ] Authentification Clerk mobile
- [ ] Catalogue et lecteur vidéo mobile (Mux)
- [ ] Progression et dashboard
- [ ] Notifications push (Expo Notifications)
- [ ] Mode hors-ligne : téléchargement de leçons (premium)

## Critères d'acceptation
- L'app fonctionne sur iOS 16+ et Android 13+
- Le lecteur vidéo fonctionne en mode portrait et paysage" \
"frontend,phase-2" "$M2"

# ── Issues Phase 3 ───────────────────────────────────────────
echo "📝 Création des issues Phase 3..."

create_issue \
"[FEAT] Sessions live Q&R avec les instructeurs" \
"## Objectif
Permettre des sessions d'apprentissage interactives en direct.

## Tâches
- [ ] Intégration Daily.co ou LiveKit pour les sessions vidéo
- [ ] Page de planning des sessions (calendrier)
- [ ] Salle d'attente et gestion des participants
- [ ] Chat textuel pendant la session
- [ ] Enregistrement automatique et disponibilité du replay en 24h
- [ ] Système de questions (levier main / upvote de questions)

## Critères d'acceptation
- Une session peut accueillir jusqu'à 100 participants
- Le replay est disponible dans les 24h avec le même lecteur que les cours" \
"frontend,backend,phase-3" "$M3"

create_issue \
"[FEAT] Programme instructeurs — création et publication de cours" \
"## Objectif
Permettre à des instructeurs tiers de créer et monétiser des cours sur MLAcademy.

## Tâches
- [ ] Formulaire de candidature instructeur
- [ ] Interface de création de cours (CMS WYSIWYG)
- [ ] Upload et encodage vidéo automatique (Mux)
- [ ] Constructeur de quiz par drag & drop
- [ ] Tableau de bord instructeur : revenus, apprenants, analytics
- [ ] Système de partage de revenus (70% instructeur / 30% plateforme)
- [ ] Stripe Connect pour les paiements vers les instructeurs

## Critères d'acceptation
- Un instructeur peut créer et publier un cours complet en moins d'une heure
- Les revenus sont transférés automatiquement chaque mois" \
"frontend,backend,payments,phase-3" "$M3"

create_issue \
"[FEAT] Moteur de recommandation personnalisé" \
"## Objectif
Recommander les prochains cours et leçons selon le profil et la progression de l'apprenant.

## Tâches
- [ ] Collecte des données comportementales (PostHog)
- [ ] Algorithme de recommandation collaboratif (user-based CF)
- [ ] Recommandations basées sur le contenu (content-based)
- [ ] A/B test des algorithmes
- [ ] Section 'Recommandés pour vous' sur le dashboard
- [ ] Email hebdomadaire personnalisé avec les suggestions

## Critères d'acceptation
- Les recommandations sont pertinentes pour 70%+ des utilisateurs (mesure NPS)
- Le système se met à jour en temps quasi-réel" \
"python,backend,phase-3" "$M3"

create_issue \
"[FEAT] Support multilingue — English version" \
"## Objectif
Étendre MLAcademy au marché anglophone.

## Tâches
- [ ] Configurer next-i18next pour FR/EN
- [ ] Traduire toute l'interface (strings, emails, métadonnées)
- [ ] Traduire les cours pilotes (P0 + P1) en anglais
- [ ] Sous-domaine en.mlacademy.fr ou mlacademy.com
- [ ] Gestion des devises (EUR/USD)
- [ ] SEO multilingue (hreflang)

## Critères d'acceptation
- L'interface complète est disponible en anglais
- Le changement de langue se fait sans rechargement de page" \
"frontend,backend,phase-3" "$M3"

# ── 7. Créer le Project GitHub ───────────────────────────────
echo "📊 Création du GitHub Project..."

PROJECT_ID=$(gh project create \
  --owner "$USERNAME" \
  --title "MLAcademy — Roadmap" \
  --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['number'])" 2>/dev/null || echo "")

if [ -n "$PROJECT_ID" ]; then
  echo "   Project créé : #$PROJECT_ID"
  gh project link "$PROJECT_ID" --owner "$USERNAME" --repo "$REPO"
fi

# ── 8. Branches de base ──────────────────────────────────────
echo "🌿 Création des branches..."
git checkout -b develop
git push origin develop
git checkout main

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "🔗 Repo      : https://github.com/$REPO_FULL"
echo "📋 Issues    : https://github.com/$REPO_FULL/issues"
echo "📊 Project   : https://github.com/$USERNAME?tab=projects"
echo ""
echo "Prochaine étape : Ouvrir VS Code et lancer 'pnpm install && pnpm dev'"

