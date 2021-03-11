<div align="center">
    <img src="https://www.24hisere.fr/data/images/logo/24hisere.svg" height="250">
</div>

# Les 24 Heures de l'Isère - Suivi en direct

Une application web de suivi en direct des performances des coureurs, réalisée avec [React](https://reactjs.org/) et [Slim](https://www.slimframework.com/).

## Mise en route

### Lancement des containers Docker

```bash
docker-compose up
```

### Installation des dépendances

API : Installation des dépendances PHP

```bash
docker-compose exec backend composer install
```

Les dépendances de l'application frontend sont installées automatiquement au lancement du docker-compose.

### Configuration

> TODO


### Accès

- Application frontend : [http://127.0.0.1](http://127.0.0.1)
- API : [http://127.0.0.1:8000](http://127.0.0.1:8000)
- PHPMyAdmin : [http://127.0.0.1:8080](http://127.0.0.1:8080)

> Si vous utiliser Docker Toolbox, changez l'adresse locale par celle de votre machine virtuelle

### Base de données

L'application utilise une base de données MySQL/MariaDB.

Identifiants du serveur MariaDB du container docker `database` :
- Utilisateur : `admin`
- Mot de passe : `admin`
- Nom de la base de données : `live`

Un jeu de données est chargé automatiquement lors du lancement du docker-compose à partir du/des fichiers SQL contenus dans le répertoire `/sql`.
