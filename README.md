<div align="center">
    <img src="https://www.24hisere.fr/data/images/logo/24hisere.svg" height="250">
</div>

# Les 24 Heures de l'Isère - Suivi en direct

Une application web de suivi en direct des performances des coureurs, réalisée avec [React](https://reactjs.org/) et [NestJS](https://nestjs.com/).

## Mise en route

### Lancement des containers Docker

```sh
docker compose up
```

Les dépendances des applications backend et frontend sont installées automatiquement au lancement du docker-compose.

### Configuration

#### Backend (API)

Créez le fichier `backend/.env` à partir du modèle `backend/.env.default` et renseignez-y les paramètres relatifs à l'environnement d'exécution.

#### Frontend

Si besoin, créez un fichier `frontend/.env.development.local` à partir du fichier `frontend/.env.development` et renseignez-y les valeurs souhaitées.

### Accès

- Application frontend : [http://127.0.0.1](http://127.0.0.1)
- API : [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Fichiers statiques : [http://127.0.0.1:8081](http://127.0.0.1:8081)
- PHPMyAdmin : [http://127.0.0.1:8080](http://127.0.0.1:8080)

> Si vous utilisez Docker Toolbox, changez l'adresse locale par celle de votre machine virtuelle

### Base de données

L'application utilise une base de données MySQL/MariaDB.

Identifiants du serveur MariaDB du container docker `database` :
- Utilisateur : `admin`
- Mot de passe : `admin`
- Nom de la base de données : `live`

Un jeu de données est chargé automatiquement lors du lancement du docker-compose à partir du/des fichiers SQL contenus dans le répertoire `/sql`.

La commande suivante permet de créer une migration et mettre à jour la structure de la base de données à partir de la structure de données définie dans `/backend-nest/prisma/schema.prisma` :

```sh
docker compose exec backend npx prisma migrate dev --name <nom migration>
```

La commande suivante permet de générer le client Prisma à partir de la structure de données définie dans `/backend-nest/prisma/schema.prisma` :

```sh
docker compose exec backend npx prisma generate
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
node dist/cli.js create-user

# Pour exécuter la commande avec l'environnement de développement Docker Compose :
docker compose exec backend node dist/cli.js create-user
```

### Modifier le mot de passe d'un utilisateur

```sh
node dist/cli.js update-user-password

# Pour exécuter la commande avec l'environnement de développement Docker Compose :
docker compose exec backend node dist/cli.js update-user-password
```

## Tests

### Backend

TODO ;)

### Frontend

```sh
docker compose exec frontend yarn test run
```

## Installation en production

1. Récupérer l'artifact du workflow GitHub, copier le fichier `live.24hisere.fr.zip` dans le dossier souhaité sur le serveur
2. Dézipper l'archive
   ```bash
   unzip live.24hisere.fr.zip
   ```
3. Installer les dépendances du backend
   ```bash
   cd backend
   yarn install
   ```
4. Créer un fichier `.env` à partir du modèle `.env.default` pour le backend
   ```bash
   cp .env.default .env
   ```
5. Dans le fichier `backend/.env`, renseigner
   1. L'URL de l'application frontend dans la variable `FRONTEND_URL` (exemple : `FRONTEND_URL="https://live.24hisere.fr"`)
   2. L'URL de connexion à la base de données dans la variable `DATABASE_URL`
6. Exécuter les migrations pour créer les tables dans la base de données
   ```bash
   npx prisma migrate deploy
   ```
   L'utilisateur doit avoir les permissions `CREATE`, `ALTER` et `INDEX`.
7. Créer le build de production pour le backend
   ```bash
   yarn build
   ```
8. Lancer l'application
   ```bash
   pm2 start dist/main.js --name live.24hisere.fr-api
   ```
