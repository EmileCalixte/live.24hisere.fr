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

Créez le fichier `backend/config/config.php` à partir du modèle `backend/config/config.default.php` et renseignez-y les paramètres relatifs à l'environnement d'exécution.

#### Frontend

Créez le fichier `frontend/src/config/config.ts` à partir du modèle `frontend/src/config/config.default.ts` et renseignez-y les paramètres relatifs à l'environnement d'exécution.

### Accès

- Application frontend : [http://127.0.0.1](http://127.0.0.1)
- API : [http://127.0.0.1:8000](http://127.0.0.1:8000)
- PHPMyAdmin : [http://127.0.0.1:8080](http://127.0.0.1:8080)

> Si vous utilisez Docker Toolbox, changez l'adresse locale par celle de votre machine virtuelle

### Base de données

L'application utilise une base de données MySQL/MariaDB.

Identifiants du serveur MariaDB du container docker `database` :
- Utilisateur : `admin`
- Mot de passe : `admin`
- Nom de la base de données : `live`

Un jeu de données est chargé automatiquement lors du lancement du docker-compose à partir du/des fichiers SQL contenus dans le répertoire `/sql`.

La commande suivante permet de mettre à jour la structure de la base de données à partir des entités Doctrine du répertoire `/backend/src/Database/Entity`:

```sh
docker compose exec backend vendor/bin/doctrine orm:schema-tool:update --dump-sql --force
```

## Import des données

### Import des coureurs

L'application backend fournit une commande à exécuter sur le serveur pour importer les coureurs à partir d'un fichier CSV.

La structure du fichier CSV doit être la suivante (l'ordre des colonnes est important, mais les intitulés des colonnes dans la ligne d'en-tête n'ont pas d'importance) : 

```csv
Dossard;Nom;Prénom;Date de naissance;Sexe
1;Doe;John;04/09/1962;M
2;Smith;Emily;13/02/1989;F
...
```

Utilisation de la commande : 

```sh 
./bin/console app:import-runners <chemin fichier CSV>

# L'option "separator" permet de préciser le séparateur de données selon le format du fichier CSV
./bin/console app:import-runners <chemin fichier CSV> --separator ","
```

L'utilisateur doit avoir la permission d'exécuter fichier `/backend/bin/console` : 

```sh
chmod u+x backend/bin/console
```

### Import des passages

Le dossier `import-passages` contient un script permettant d'importer les temps des passages des coureurs toutes les 15 secondes depuis un fichier DAG, permettant de mettre à jour les informations en direct chez les utilisateurs.

[Documentation détaillée](import-passages/README.md)

## Utilisateurs

Il est nécessaire d'être connecté sur un compte d'utilisateur pour accéder à certaines informations et effectuer certaines opérations.

Un utilisateur est inclut dans les données chargées par défaut depuis le répertoire `/sql` :

- Nom d'utilisateur : `Admin`
- Mot de passe : `admin`

### Créer un utilisateur

```sh
./bin/console app:create-user
 
# Pour exécuter la commande avec l'environnement de développement Docker Compose :
docker compose exec backend ./bin/console app:create-user
```

## Tests

### Backend

```sh 
docker compose exec backend ./vendor/bin/phpunit --testdox tests
```
