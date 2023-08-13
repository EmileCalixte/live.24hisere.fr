<div align="center">
    <img src="https://www.24hisere.fr/data/images/logo/24hisere.svg" height="250">
</div>

# Les 24 Heures de l'Isère - Suivi en direct

Une application web de suivi en direct des performances des coureurs, réalisée avec [React](https://reactjs.org/) et [Slim](https://www.slimframework.com/).

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

Créez le fichier `frontend/src/config/config.ts` à partir du modèle `frontend/src/config/config.default.ts` et renseignez-y les paramètres relatifs à l'environnement d'exécution.

### Accès

- Application frontend : [http://127.0.0.1](http://127.0.0.1)
- API : [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Fichiers statiques : [http://127.0.0.1:9000](http://127.0.0.1:9000)
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

## Tests

TODO ;)
