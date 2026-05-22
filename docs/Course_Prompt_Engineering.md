# Master Content Template : Maîtriser le Prompt Engineering

---

## 1. Identity (Meta)

**Titre du Cours :** Maîtriser le Prompt Engineering avec Claude et GPT
**Difficulté :** Intermédiaire
**Prérequis :** Avoir utilisé occasionnellement ChatGPT ou Claude.
**Durée Estimée :** 2 Heures
**Auteur / Expert :** Instructeur IA

---

## 2. Learning Objectives (Bloom's Taxonomy)

À la fin de ce cours, l'apprenant sera capable de :
1. **Comprendre** les mécanismes sous-jacents des LLM (Large Language Models) et comment ils interprètent les requêtes.
2. **Appliquer** le framework CPTF (Contexte, Persona, Tâche, Format) pour structurer des prompts précis.
3. **Évaluer** et itérer sur des prompts pour minimiser les hallucinations et les biais.
4. **Construire** un flux de travail automatisé (workflow) en utilisant des balises XML.

---

## 3. The Modular Flow (Structure du Cours)

| Module | Titre de la Leçon | Format | Objectif d'apprentissage | La Règle d'Action (Activité Pratique) |
|---|---|---|---|---|
| **Module 1 : Fondations des LLMs** | 1.1 Ce qu'est (et n'est pas) un LLM | Vidéo | Comprendre le fonctionnement prédictif. | N/A |
| | 1.2 Anatomie d'un mauvais prompt | Texte | Identifier les erreurs communes. | "Prenez un mauvais prompt et réécrivez-le." |
| | Quiz M1 | Quiz | Valider les connaissances M1 | 3 questions flash. |
| **Module 2 : Le Framework CPTF** | 2.1 Le Contexte et le Persona | Vidéo | Savoir donner un rôle à l'IA. | "Définissez un persona d'expert juridique." |
| | 2.2 Tâche et Format (XML) | Vidéo | Structurer la sortie avec des balises XML. | "Demandez un résumé au format JSON." |
| **Module 3 : Techniques Avancées** | 3.1 Few-Shot Prompting | Texte | Fournir des exemples pour guider l'IA. | "Créez un prompt avec 3 exemples de classification." |
| | 3.2 Chain of Thought (CoT) | Notebook | Forcer l'IA à raisonner étape par étape. | "Résolvez un problème logique avec CoT." |

---

## 4. Assessment Rubric (Grille d'Évaluation du Projet Final)

**Titre du Projet :** Création d'un Agent d'Assistance Client par Email
**Description :** L'apprenant doit rédiger un "System Prompt" complet permettant à l'IA de répondre automatiquement et poliment aux réclamations clients, en extrayant les informations clés (Numéro de commande, Motif) au format JSON.
**Critère de validation minimal :** Score "Compétent" partout (> 80%).

| Critère d'évaluation | ❌ Insuffisant (0-40) | ⚠️ En Cours d'Acquisition (40-70) | ✅ Compétent (70-90) | 🌟 Expert (90-100) |
|---|---|---|---|---|
| **Structure CPTF** | Le prompt est un simple paragraphe confus. | Certaines parties manquent (ex: pas de format). | Le Contexte, Persona, Tâche et Format sont clairs. | La structure est optimisée, utilisant des délimiteurs clairs (ex: `###` ou XML). |
| **Prévention des Hallucinations** | Aucune instruction sur ce qu'il faut faire en cas de doute. | Instructions basiques ("Ne mens pas"). | Instruction claire : "Si l'info manque, demande des précisions". | Prévention avancée avec des contraintes strictes. |
| **Respect du Format (JSON)** | La sortie n'est pas en JSON. | Le JSON est mal formaté ou inclut du texte inutile. | Le JSON est valide et correspond à la demande. | Le JSON inclut une gestion d'erreur (ex: `{"error": "missing_order_id"}`). |
