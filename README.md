# Support Desk — Application de gestion des incidents

> Projet 3 CDA (RNCP 37873) — *Développer et tester le front-end d'une application de support, puis en réaliser l'audit.*

Application web permettant aux collaborateurs d'une entreprise de **déclarer des incidents**, au support de **les traiter** et au responsable de **piloter l'activité**. Elle remplace un traitement par e-mail source de pertes d'informations et de manque de visibilité.

Le front-end (Vue 3 + TypeScript) est connecté à **Firebase** (Authentication + Realtime Database) utilisé comme BaaS.

---

## Sommaire

1. [Équipe et organisation](#1-équipe-et-organisation)
2. [Fonctionnalités et profils](#2-fonctionnalités-et-profils)
3. [Stack technique](#3-stack-technique)
4. [Architecture du projet](#4-architecture-du-projet)
5. [Prérequis](#5-prérequis)
6. [Installation](#6-installation)
7. [Configuration (sans secret)](#7-configuration-sans-secret)
8. [Préparation des données fictives](#8-préparation-des-données-fictives)
9. [Lancement de l'application](#9-lancement-de-lapplication)
10. [Tests](#10-tests)
11. [Modèle de données Firebase](#11-modèle-de-données-firebase)
12. [Sécurité et contrôle d'accès](#12-sécurité-et-contrôle-daccès)
13. [Audit](#13-audit)
14. [Workflow Git](#14-workflow-git)
15. [Démonstration](#15-démonstration)
16. [Limites connues](#16-limites-connues)

---

## 1. Équipe et organisation

| Membre | Rôle dans l'équipe | Périmètre principal |
|---|---|---|
| _À compléter_ | Coordination | _À compléter_ |
| _À compléter_ | Développement / tests | _À compléter_ |
| _À compléter_ | Développement / audit | _À compléter_ |

- **Tableau Kanban** : _lien à compléter_
- **Support de présentation** : _lien à compléter_
- **Fonctionnalité présentée à l'oral** : _à compléter (ex. création d'un ticket)_

---

## 2. Fonctionnalités et profils

Un ticket comporte : titre, description, auteur, catégorie, priorité, statut, dates de création et de mise à jour, technicien affecté (optionnel), commentaires et historique.

### Profils (rôles)

| Id | Rôle | Droits principaux |
|---|---|---|
| 1 | **Collaborateur** | Déclarer un incident, consulter ses tickets, commenter, voir l'historique |
| 2 | **Technicien** | Consulter les tickets autorisés, traiter ceux qui lui sont affectés, changer leur statut, documenter, clôturer |
| 3 | **Responsable du support** | Consulter tous les tickets, affecter aux techniciens, suivre les indicateurs |
| 4 | **Administrateur** | Gérer les comptes et les rôles |

### Écrans et accès (routes)

| Route | Écran | Rôles autorisés |
|---|---|---|
| `/` ou `/connexion` | Connexion | Public |
| `/dashboard` | Tableau de bord | Tous (connecté) |
| `/page-ticket` | Liste des tickets (filtres, recherche, tri, pagination) | 1, 2, 3, 4 |
| `/tickets/:id` | Détail d'un ticket (statut, priorité, affectation, commentaires, historique) | 1, 2, 3, 4 |
| `/create-ticket` | Déclaration d'un incident | 1, 3, 4 |
| `/analytics` | Indicateurs du support (tickets ouverts, SLA, temps de résolution, charge par technicien) | 3, 4 |
| `/create-compte` ou `/register` | Création de compte | 4 |

### Statuts et priorités

- **Statuts** : `Nouveau → En cours → Résolu → Clôturé`
- **Priorités** : `Basse`, `Moyenne`, `Haute`, `Critique`
- **Catégories** : Réseau, Matériel, Logiciel, Accès

> La matrice des droits complète et les critères d'acceptation sont disponibles dans le Kanban / support de présentation (_lien à compléter_).

---

## 3. Stack technique

| Domaine | Outil | Justification |
|---|---|---|
| Framework | **Vue 3** (Composition API) | Composants réutilisables, réactivité simple, courbe d'apprentissage adaptée à l'équipe |
| Langage | **TypeScript** | Typage des modèles (`Ticket`, `TicketStatus`…) et détection d'erreurs à la compilation |
| Build | **Vite** | Démarrage et rechargement à chaud rapides |
| Routage | **Vue Router** | Routes protégées par authentification et par rôle |
| État | **Pinia** | Store d'authentification partagé |
| UI | **Tailwind CSS + DaisyUI**, icônes **lucide-vue-next** | Responsive mobile / tablette / desktop, composants accessibles de base |
| BaaS | **Firebase** (Auth + Realtime Database) | Authentification, persistance et règles de sécurité côté serveur |
| Tests unitaires | **Vitest** + `@vue/test-utils` + `happy-dom` | Intégré à Vite, rapide, couverture via `@vitest/coverage-v8` |
| Tests E2E | **Cypress** | Parcours utilisateur réels dans le navigateur |

---

## 4. Architecture du projet

Le code sépare **l'interface** (vues, composants), **les règles métier** (utils) et **l'accès aux données** (services).

```
src/
├── main.ts                 # Point d'entrée (Vue, Pinia, Router)
├── App.vue                 # Choix du layout (app / blank)
├── router/index.ts         # Routes + garde d'authentification et de rôle
├── stores/authStore.ts     # Store Pinia de l'utilisateur connecté
├── services/               # Accès aux données (Firebase)
│   ├── firebase.ts         # Initialisation Firebase à partir du .env
│   ├── ticketListeService.ts  # CRUD tickets, commentaires, historique
│   ├── ticketService.ts    # Ré-export du service tickets
│   └── dashboard.service.ts   # Requêtes et calculs des indicateurs
├── view/                   # Pages (Connexion, Dashboard, TicketsPage, TicketDetailPage, CreateTicket, Analytics, RegisterForm…)
├── layout/                 # Navbar, Sidebar
└── components/
    ├── TicketForm.vue      # Formulaire de déclaration d'incident
    ├── tickets/            # Tableau, filtres, recherche, pagination, badges
    ├── dashboard/          # Cartes du tableau de bord
    ├── analytics/          # Cartes des indicateurs
    ├── types/ticket.ts     # Types et libellés métier
    └── utils/ticketList.ts # Règles métier pures (filtre, tri, comptage)

tests/                      # Tests unitaires Vitest
cypress/e2e/                # Tests end-to-end Cypress
```

### Cheminement d'une requête

```
Navigateur (composant Vue)
   │  appel d'une fonction de service (ex. saveTicket)
   ▼
src/services/*.ts  ──► SDK Firebase (HTTPS / WebSocket, jeton d'authentification)
                               ▼
                 Firebase Realtime Database
                 └─ règles de sécurité (vérification du rôle côté serveur)
```

---

## 5. Prérequis

- [Node.js](https://nodejs.org/) **LTS** (≥ 20 recommandé, requis par Vite 8)
- **npm** (ou pnpm)
- [Git](https://git-scm.com/)
- Un **projet Firebase** avec :
  - *Authentication* → méthode **E-mail / mot de passe** activée
  - *Realtime Database* créée
- Pour les tests E2E : un navigateur supporté par Cypress (Chrome, Edge, Firefox ou Electron fourni)

---

## 6. Installation

```bash
git clone https://github.com/ToYzY9/tpGroupe_dev-frontend-et-audit.git
```

```bash
cd tpGroupe_dev-frontend-et-audit
```

```bash
npm install
```

---

## 7. Configuration (sans secret)

La configuration Firebase est lue depuis les **variables d'environnement Vite**. Aucune valeur n'est versionnée : le fichier `.env` est ignoré par Git.

1. Copier le fichier d'exemple :

   ```bash
   cp .env.example .env
   ```

2. Renseigner les valeurs depuis *Console Firebase → Paramètres du projet → Vos applications → Configuration du SDK* :

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_DATABASE_URL=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

> Si une variable manque, l'application s'arrête au démarrage avec le message
> `Configuration Firebase incomplète dans .env : …` (voir [`src/services/firebase.ts`](src/services/firebase.ts)).

> ℹ️ La clé `apiKey` Firebase n'est **pas une clé privilégiée** : elle identifie le projet côté navigateur. La protection des données repose sur les **règles de sécurité** de la base (§ 12). Aucune clé de compte de service (Admin SDK) ne doit être ajoutée au dépôt.

### Identifiants des tests Cypress

Les identifiants des comptes de test sont placés dans `cypress.env.json` (ignoré par Git). Créer ce fichier localement si besoin, avec des **comptes fictifs** uniquement.

---

## 8. Préparation des données fictives

Toutes les données utilisées sont **fictives**.

1. **Tables de référence** à créer dans la Realtime Database :
   - `roles` : `{ id_role, role_name }` → 1 Collaborateur, 2 Technicien, 3 Responsable, 4 Administrateur
   - `categories` : `{ id_category, category_name }` → 1 Réseau, 2 Matériel, 3 Logiciel, 4 Accès
2. **Comptes de test** — créer dans *Authentication* au moins :
   - 1 Administrateur, 1 Responsable, 1 Technicien
   - **2 Collaborateurs** (pour vérifier l'isolation des données)
3. **Profils** — pour chaque compte, créer `profiles/<uid>` avec au minimum `role` (1 à 4), `full_name` et `id_profile`.
   Une fois un administrateur créé, les autres comptes peuvent être créés depuis l'écran `/create-compte`.
4. **Index** — ajouter dans les règles l'index nécessaire à la recherche d'un ticket par identifiant :

   ```json
   "tickets": { ".indexOn": ["id_ticket"] }
   ```

5. **Tickets** — se connecter en Collaborateur et créer quelques tickets via `/create-ticket` (ou importer un JSON de démo depuis la console Firebase).

> _Optionnel : ajouter au dépôt un fichier `seed/demo-data.json` importable et un `database.rules.json` (voir § 16)._

---

## 9. Lancement de l'application

Serveur de développement (http://localhost:5173) :

```bash
npm run dev
```

Build de production (vérification TypeScript + bundle) :

```bash
npm run build
```

Prévisualisation du build :

```bash
npm run preview
```

---

## 10. Tests

### Tests unitaires (Vitest)

Couvrent les règles métier développées par l'équipe : filtrage, tri, comptage des tickets ([`tests/ticketList.test.ts`](tests/ticketList.test.ts)) et calculs du tableau de bord avec Firebase simulé ([`tests/dashboard.test.ts`](tests/dashboard.test.ts)).

```bash
npm test
```

Avec rapport de couverture (généré dans `coverage/`) :

```bash
npm run coverage
```

### Tests end-to-end (Cypress)

Les tests E2E s'exécutent contre l'application lancée en local. Démarrer d'abord le serveur :

```bash
npm run dev
```

Puis, dans un second terminal, en mode interactif :

```bash
npx cypress open
```

ou en mode headless :

```bash
npx cypress run
```

| Fichier | Scénarios couverts |
|---|---|
| `connexion.cy.ts` | Connexion valide, mauvais mot de passe, formulaire vide, accès protégé |
| `inscription.cy.ts` | Création de compte : cas valide, champs manquants, données invalides |
| `dashboard.cy.ts`, `dashboardComponents.cy.ts` | Affichage du tableau de bord et de ses composants |
| `detailTicket.cy.ts` | Consultation du détail d'un ticket |

### Plan de tests et recette

Chaque cas de test est tracé avec : identifiant (ex. `CT-05`), exigence couverte, préconditions et rôle, données, étapes, résultat attendu, résultat observé, statut (*Réussi / Échoué / Non exécuté*), preuve, anomalie liée, date et commit testé.

- **Cahier de tests / recette** : _lien à compléter_

---

## 11. Modèle de données Firebase

Realtime Database (nœuds principaux) :

| Nœud | Contenu |
|---|---|
| `profiles/<uid>` | `id_profile`, `full_name`, `role` |
| `roles` | `id_role`, `role_name` |
| `categories` | `id_category`, `category_name` |
| `tickets` | `id_ticket`, `title`, `description`, `id_category`, `id_priority` (1 Critique → 4 Basse), `id_status` (1 Nouveau → 4 Clôturé), `id_author`, `id_technician`, `created_at`, `last_update` |
| `comment/<id_ticket>/<pushId>` | `content`, `author`, `created_at` |
| `history/<id_ticket>/<pushId>` | `field`, `old_value`, `new_value`, `changed_by`, `updated_at` |

Appels principaux (voir [`src/services/ticketListeService.ts`](src/services/ticketListeService.ts)) :

| Fonction | Opération Firebase |
|---|---|
| `saveTicket` | `runTransaction` sur `tickets` (numéro unique, évite les doublons) |
| `getTicketById` | `query(orderByChild('id_ticket'), equalTo(id))` |
| `updateTicketFields` | `update` du statut, de la priorité et du technicien |
| `saveComment` / `getComments` | `push` / `get` sur `comment/<id>` |
| `saveTicketHistory` / `getTicketHistory` | `push` / `get` sur `history/<id>` |
| `canCreateTicket` | Lecture de `profiles/<uid>/role` |

---

## 12. Sécurité et contrôle d'accès

Le contrôle d'accès est appliqué à **deux niveaux** :

1. **Navigateur (confort utilisateur)** — le garde du routeur ([`src/router/index.ts`](src/router/index.ts)) redirige vers la connexion sans session, et vers le tableau de bord si le rôle n'est pas autorisé.
2. **BaaS (sécurité effective)** — les **règles de sécurité Firebase** vérifient le rôle lu dans `profiles/<uid>/role` avant toute lecture ou écriture. Masquer un bouton ou protéger une route côté client **ne suffit pas**.

Autres mesures :

- Aucun secret dans le dépôt (`.env` et `cypress.env.json` ignorés) ;
- Contenus saisis affichés via l'interpolation Vue (`{{ }}`), qui échappe le HTML (pas de `v-html` sur les données utilisateur) ;
- Bouton de soumission désactivé pendant l'envoi pour empêcher les doubles soumissions.

---

## 13. Audit

L'audit est réalisé sur une version identifiée (tag / commit), de préférence par un membre n'ayant pas développé la partie examinée.

| Axe | Contrôles | Outils |
|---|---|---|
| Qualité du code | Structure, duplication, lisibilité, gestion d'erreurs, revue d'au moins une PR | Revue de code, `vue-tsc` |
| Accessibilité | Clavier, focus, libellés, erreurs, contrastes, titres | Lighthouse, DevTools, tests manuels |
| Responsive / ergonomie | Mobile, tablette, desktop, zoom, contenus longs | DevTools (émulation) |
| Performances | Chargement, requêtes réseau, poids des ressources, avant / après correction | Lighthouse, onglet Réseau |
| Sécurité | Droits par rôle, règles Firebase, secrets, affichage sûr des saisies | Tests avec comptes de rôles différents |

Priorités : **Bloquante** (parcours impossible, perte de données, accès non autorisé) · **Majeure** · **Mineure**.

- **Compte rendu d'audit** (constats, preuves, corrections, contrôles après correction) : _lien à compléter_

---

## 14. Workflow Git

- `main` : version stable et démontrable
- `develop` : intégration des développements
- Une branche par fonctionnalité ou correction : `feat/<slug>`, `fix/<slug>`, `test/<slug>`, `chore/<slug>`
- Intégration par **pull request** relue par un autre membre
- Messages de commit au format *Conventional Commits* : `type(scope): message`
- Version livrée identifiée par un **tag** : _à compléter (ex. `v1.0.0`)_

---

## 15. Démonstration

- **Version présentée** : tag / commit _à compléter_
- **URL de démonstration** : _à compléter (ou lancement local, § 9)_
- **Comptes de démonstration** : comptes fictifs par rôle, communiqués au jury hors dépôt
- **Vidéo / captures de secours** : _lien à compléter_

Parcours conseillé : connexion Collaborateur → création d'un ticket → connexion Responsable → affectation à un technicien → connexion Technicien → changement de statut + commentaire → vérification de l'historique → indicateurs.

---

## 16. Limites connues

- **Règles de sécurité Firebase non versionnées** : elles sont configurées dans la console ; un fichier `database.rules.json` reste à ajouter au dépôt pour la reproductibilité.
- **Pas de jeu de données importable** : la préparation des données fictives est manuelle (§ 8).
- **Création de comptes côté client** : l'administrateur crée les comptes via une instance Firebase secondaire dans le navigateur ; une Cloud Function (Admin SDK) serait plus sûre pour cette opération privilégiée.
- **Commentaires** : deux nœuds coexistent (`comments` lu pour la liste, `comment/<id>` pour le détail) ; à unifier.
- **Pièces jointes et notifications** : non implémentées.
- **Lint** : aucun linter (ESLint) configuré dans les scripts.
- **Tests E2E** : URL `http://localhost:5173` codée en dur (pas de `baseUrl`), aucun script npm dédié ; `spec1.cy.ts` et `tests/sum.test.ts` sont des exemples sans lien avec le métier.
- **Cycle complet multi-rôles** (affectation → traitement → clôture) : _à compléter selon l'état réel de la recette_.
