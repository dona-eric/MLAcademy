<p align="center">
  <img src="AcademyFrontend/public/mlacademy_logo.png" alt="MLAcademy" width="120" />
</p>

<h1 align="center">MLAcademy</h1>
<p align="center">La référence francophone en Data Science & Machine Learning</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" /></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript" /></a>
</p>

---

## Présentation

MLAcademy est une plateforme e-learning dédiée à l'apprentissage du Machine Learning et de la Data Science en langue française. Elle propose des parcours structurés, des notebooks Python interactifs, des certifications et une communauté active.

## Architecture

```
MLAcademy/
├── frontend/          # Next.js 14 — Interface utilisateur
├── backend-api/       # tRPC + Prisma — API principale
├── backend-python/    # FastAPI — Exécution de code Python
├── packages/shared/   # Types et utilitaires partagés
└── .github/           # CI/CD et templates
```

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | tRPC, Prisma, PostgreSQL |
| Exécution code | FastAPI, Python 3.11 |
| Auth | Clerk |
| Vidéo | Mux.io |
| Stockage | Cloudflare R2 |
| Paiements | Stripe |
| Cache | Redis (Upstash) |

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/TON_USERNAME/MLAcademy.git
cd MLAcademy

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Remplir les variables dans .env.local

# 4. Initialiser la base de données
cd backend-api && pnpm db:migrate && pnpm db:seed

# 5. Lancer en développement
pnpm dev
```

## Parcours disponibles

| Parcours | Niveau | Durée |
|----------|--------|-------|
| P0 — Fondamentaux | Débutant | ~40h |
| P1 — Machine Learning | Intermédiaire | ~60h |
| P2 — Data Science Pro | Avancé | ~50h |
| P3 — Maths pour le ML | Tous niveaux | ~30h |

## Roadmap

- [x] Architecture et structure du projet
- [ ] Phase 1 — MVP (Mois 1-3)
- [ ] Phase 2 — Enrichissement (Mois 4-6)
- [ ] Phase 3 — Communauté & Scale (Mois 7-12)

## Licence

Propriétaire — © 2025 MLAcademy. Tous droits réservés.
