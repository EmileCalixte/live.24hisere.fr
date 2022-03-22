# Utilisation du script d'import

## Prérequis

Le script a été testé avec PowerShell 5.1.

## Configuration

Créez le fichier `config.json` à partir du modèle `config.default.json` et renseignez-y les paramètres (URL ou chemin du fichier de données, clé secrète...)

## Utilisation

```powershell
.\import.ps1
```

Si le script ne rencontre pas d'erreur au lancement, il enverra les données au serveur toutes les 15 secondes.

Le script tourne indéfiniment. Pour l'arrêter, faites Ctrl+C ou fermez le terminal dans lequel il s'exécute.
