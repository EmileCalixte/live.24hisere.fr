$sleepTime = 15 # In seconds
$scriptPath = $MyInvocation.MyCommand.Path
$scriptParentDir = Split-Path -Path $scriptPath -Parent
$configFilePath = "$scriptParentDir\config.json"

function log {
    Param($string)
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$time] $string"
}

log($scriptParentDir)

log("Lancement du script d'import automatique")
log("Les données seront envoyées au serveur toutes les $sleepTime secondes")
log("Arrêtez l'exécution avec Ctrl+C")

Write-Host ""

log("Lecture du fichier de configuration : $configFilePath")

$configFileExists = Test-Path -Path $configFilePath -PathType Leaf

if (-Not $configFileExists) {
    log("Fichier de configuration non trouvé !");
    Exit 1;
}

# TODO read config file

while ($true) {
    log("Lecture du fichier de données")

    # TODO

    log("Envoi des données au serveur")

    # TODO

    log("Prochain envoi dans $sleepTime secondes")
    Start-Sleep -s $sleepTime
}
