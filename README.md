Bienvenue dans la documentation de l'API Notefy. Cette application permet de gérer des notes personnelles, de les protéger par mot de passe, de les rendre privées ou publiques, et de gérer des favoris.

##  Modélisation de la Base de Données

Les diagrammes de conception sont disponibles dans le dossier `docs/` :
- [**MCD** (Modèle Conceptuel de Données)](docs/mcd.drawio) : Représentation des entités et relations.
- [**MLD** (Modèle Logique de Données)](docs/mld.drawio) : Détail des tables, colonnes et clés étrangères.
- [**UML Use-case**](docs/uml%20Use-case.drawio) : Diagramme des cas d'utilisation.
- [**UML Généralisation de rôle**](docs/uml%20generasilation%20de%20role.drawio) : Diagramme de structure des rôles.

---
## 🛠️ Installation et Configuration Locale

Pour tester l'application en local, suivez ces étapes :

### 1. Prérequis
- **Node.js** (dernière version LTS recommandée)
- **MySQL** installé et en cours d'exécution

### 2. Création de la Base de Données
Ouvrez votre terminal MySQL (ou un outil comme MySQL Workbench) et exécutez les commandes suivantes :

```sql
-- Connexion à MySQL
mysql -u root -p

-- Création de la base de données
CREATE DATABASE notefy_db;

-- (Optionnel) Création d'un utilisateur dédié
CREATE USER 'notefy_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON notefy_db.* TO 'notefy_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration des variables d'environnement
Le projet utilise des fichiers `.env` pour stocker les informations sensibles.

1.  Allez dans le dossier `server/`.
2.  Copiez le fichier `.env.sample` et renommez-le en `.env`.
3.  Modifiez les valeurs pour correspondre à votre configuration locale :

```bash
# server/.env
APP_PORT=3310
APP_SECRET=votre_cle_secrete_jwt
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=notefy_db
CLIENT_URL=http://localhost:3000
```

### 4. Exemple de configuration en Production
Pour un déploiement (ex: Alwaysdata), votre fichier `.env` ressemblera à ceci :

```bash
# server/.env (Production)
APP_PORT=3310
APP_SECRET=mZTUjliavcgSjw9Iv1euKnHJqrP7IudK
DB_HOST=mysql-julesbdev.alwaysdata.net
DB_PORT=3306
DB_USER=julesbdev
DB_PASSWORD=Julesbdev2026!
DB_NAME=julesbdev_notefy
CLIENT_URL=http://localhost:3000
PROJECT_NAME_SPECIFIC_NAME=Notefy
```

### 5. Lancement du projet
Retournez à la racine du projet et exécutez :

```bash
npm install        # Installer les dépendances
npm run db:migrate # Lancer les migrations (si applicable)
npm run db:seed    # Remplir la base avec des données de test
npm run dev        # Lancer le client et le serveur en même temps
```

---

## 🚀 Serveur (API REST)

L'API est construite avec **Node.js** et **Express**. Elle utilise des Jetons Web JSON (JWT) pour l'authentification et **Argon2** pour le hachage des mots de passe.

**URL de base :** `http://localhost:3310` (toutes les routes commencent par `/api`)

### 🔐 Authentification

#### 1. Connexion
*   **Route :** `POST /api/login`
*   **Description :** Authentifie un utilisateur et retourne un jeton JWT.
*   **Corps (JSON) :**
    ```json
    {
      "email": "user@example.com",
      "password": "votre_mot_de_passe"
    }
    ```
*   **Réponse (200 OK) :**
    ```json
    {
      "token": "eyJhbG...",
      "user": { "id": 1, "email": "...", "role": "user" }
    }
    ```

#### 2. Inscription
*   **Route :** `POST /api/users`
*   **Description :** Crée un nouveau compte utilisateur.
*   **Corps (JSON) :** `email`, `password`, `firstname` (optionnel), `lastname` (optionnel).
*   **Réponse :** `201 Created` ou `409 Conflict` (si l'email existe déjà).
113: 
114: #### 3. Vérification de la session
115: *   **Route :** `GET /api/me`
116: *   **Description :** Vérifie si l'utilisateur est authentifié et si son jeton est toujours valide.
117: *   **Authentification :** Requise (Bearer Token ou Cookie).
118: *   **Réponse (200 OK) :** `{ "message": "Authorized" }`
119: *   **Réponse (401 Unauthorized) :** `{ "message": "Unauthorized" }`

---

### 📝 Gestion des Notes

#### 1. Lister les notes
*   **Route :** `GET /api/notes`
*   **Authentification :** Optionnelle (Bearer Token).
*   **Description :** Retourne les notes publiques. Si authentifié, retourne également les notes privées de l'utilisateur.

#### 2. Voir une note par Slug
*   **Route :** `GET /api/notes/:slug`
*   **Description :** Récupère le contenu d'une note. Retourne une propriété `auth: true` si l'utilisateur connecté est l'auteur. Si elle est protégée par mot de passe, le contenu sera masqué jusqu'à vérification.

#### 3. Vérifier le mot de passe d'une note
*   **Route :** `POST /api/notes/:slug/verify-password`
*   **Corps :** `{ "password": "..." }`
*   **Description :** Débloque le contenu d'une note protégée.

#### 4. Créer / Modifier / Supprimer (Protégé)
*   **Routes :** `POST /api/notes`, `PUT /api/notes/:id`, `DELETE /api/notes/:id`
*   **Authentification :** Requise (Bearer Token).
*   **Champs :** `name`, `content`, `is_private` (booléen), `password` (optionnel).

---

### ⭐ Favoris (Protégé)

*   `GET /api/favorites` : Liste toutes les notes mises en favoris par l'utilisateur.
*   `POST /api/favorites` : Ajoute une note aux favoris (`{ "noteId": id }`).
*   `DELETE /api/favorites/:id` : Retire une note des favoris.

---

## 💻 Fonctionnement du Client (Frontend)

Le frontend est développé avec **React**, **Vite** et **Tailwind CSS**.

### 🔑 Gestion des Sessions et Cookies
Le client a migré de `localStorage` vers les **Cookies** pour une meilleure gestion de la sécurité et de la persistance.
- **Stockage :** Le jeton `token` est stocké dans un cookie avec une durée de vie de 7 jours.
- **Utilitaires (`client/src/utils/auth.ts`) :**
    - `islogin(require)` : Vérifie la présence et la validité (expiration) du JWT en décodant la charge utile (payload). Si `require` est vrai et que l'utilisateur n'est pas connecté, il est redirigé vers `/login`.
    - `logout()` : Supprime le cookie et redirige vers la page de connexion.

### ⚡ Performance et Optimisation
- **Lazy Loading :** Les composants lourds comme `NoteView` et `NoteEdit` sont chargés de manière asynchrone via `React.lazy`.
- **Suspense :** Un composant `Loading` est affiché pendant le chargement des pages ou des composants asynchrones.
- **Gestion des erreurs JWT :** Le client intercepte les erreurs HTTP `401 Unauthorized` pour déconnecter automatiquement l'utilisateur si son jeton a expiré ou a été révoqué.

### 🎨 Interface et Composants
- **Mode Sombre :** Support natif du mode sombre/clair via un `ThemeProvider`.
- **Composants Partagés :** `Footer` (présent sur toutes les pages) et `Loading`.
- **Navigation :** Utilisations de `react-router` pour une navigation fluide sans rechargement de page.

---

## ⚖️ Licence et Attribution

Ce projet est **open-source**. Vous êtes libre de l'utiliser et de le modifier pour vos propres besoins. Cependant, **il est strictement interdit de s'approprier la paternité du code original**. Toute utilisation ou redistribution doit mentionner l'auteur original MrX (Beaufort Jules).

Pour plus de détails, consultez le fichier [LICENSE.md](LICENSE.md).

---

*Document mis à jour le 12 Mars 2026 par Antigravity à l'aide de l'IA.*
