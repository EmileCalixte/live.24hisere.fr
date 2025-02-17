<div align="center">
    <img src="https://www.24hisere.fr/data/images/logo/24hisere.svg" height="250">
</div>

# Les 24 Heures de l'Isère - Suivi en direct

Une application web de suivi en direct des performances des coureurs, réalisée avec [React](https://reactjs.org/) et [NestJS](https://nestjs.com/).

## Mise en route

### Installation des dépendances

```sh
pnpm install
```

### Lancement de l'environnement de développement

```sh
docker compose up -d
pnpm dev
```

### Configuration

#### Backend (API)

Créez le fichier `apps/backend/.env` à partir du modèle `apps/backend/.env.default` et renseignez-y les paramètres relatifs à l'environnement d'exécution.

#### Frontend

Si besoin, créez un fichier `apps/frontend/.env.development.local` à partir du fichier `apps/frontend/.env.development` et renseignez-y les valeurs souhaitées.

### Accès

- Application frontend : [http://localhost:3000](http://localhost:3000)
- API : [http://localhost:8000](http://localhost:8000)
- Fichiers statiques : [http://localhost:8081](http://localhost:8081)
- PHPMyAdmin : [http://localhost:8080](http://localhost:8080)

### Base de données

L'application utilise une base de données MySQL/MariaDB.

Identifiants du serveur MariaDB du container docker `database` :
- Utilisateur : `admin`
- Mot de passe : `admin`
- Nom de la base de données : `live`

Un jeu de données est chargé automatiquement lors du lancement du docker-compose à partir du/des fichiers SQL contenus dans le répertoire `/sql`.

La commande suivante permet de créer une migration à partir de la structure de données définie dans `apps/backend/drizzle/schema.ts` :

```sh
pnpm backend createmigration <nom migration>
```

La commande suivante permet d'exécuter les migrations pour mettre à jour la structure de la base de données :

```sh
pnpm backend migrate
```

## Import des données

### Import des passages

TODO (documenter la task nest)

## Utilisateurs

Il est nécessaire d'être connecté sur un compte d'utilisateur pour accéder à certaines informations et effectuer certaines opérations.

Un utilisateur est inclut dans les données chargées par défaut depuis le répertoire `/sql` :

- Nom d'utilisateur : `Admin`
- Mot de passe : `admin`

### Créer un utilisateur

```sh
pnpm backend create-user
```

### Modifier le mot de passe d'un utilisateur

```sh
pnpm backend update-password
```

## Tests

```sh
pnpm test
```

## Installation en production

1. Cloner le dépôt GitHub dans le dossier souhaité sur le serveur
2. S'assurer que la version de node installée est correcte (`cat .nvmrc` - `node -v`). S'assurer également que MariaDB est au moins en version 10.6
3. Installer les dépendances du projet
   ```bash
   pnpm install
   ```
4. Créer un fichier `.env` à partir du modèle `.env.default` pour le backend
   ```bash
   cd apps/backend
   cp .env.default .env
   ```
5. Dans le fichier `.env` créé, renseigner
   1. `NODE_ENV=production`
   2. L'URL de l'application frontend dans la variable `FRONTEND_URL` (exemple : `FRONTEND_URL="https://live.24hisere.fr"`)
   3. Les identifiants de connexion à la base de données dans les variables `DB_NAME`, `DB_USERNAME` et `DB_PASSWORD`
6. Générer les builds de production
   ```bash
   pnpm build
   ```
7. Exécuter les migrations pour créer les tables dans la base de données
   ```bash
   pnpm backend migrate
   ```
   L'utilisateur doit avoir les permissions `CREATE`, `ALTER`, `DROP` et `INDEX`.
8. Lancer l'application
   ```bash
   cd apps/backend
   pm2 start /dist/src/main.js --name live.24hisere.fr-api
   ```
   Il est important de se positionner dans le répertoire racine du backend puis de lancer pm2 depuis ce répertoire, car pm2 lit le fichier `.env` situé à l'endroit où la commande est lancée.

### Mise à jour

Pour mettre à jour l'application sur le serveur :

1. Télécharger les changements avec `git pull`
2. Installer les éventuelles nouvelles dépendances avec `pnpm install`
3. Regénérer les builds de production avec `pnpm build`
4. Exécuter les migrations de base de données avec `pnpm backend migrate`
5. Relancer le backend
   ```bash
   pm2 restart live.24hisere.fr-api
   ```
