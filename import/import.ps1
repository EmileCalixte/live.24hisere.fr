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
log("Les donn�es seront envoy�es au serveur toutes les $sleepTime secondes")
log("Arr�tez l'ex�cution avec Ctrl+C")

Write-Host ""

log("Lecture du fichier de configuration : $configFilePath")

$configFileExists = Test-Path -Path $configFilePath -PathType Leaf

if (-Not $configFileExists) {
    log("Fichier de configuration non trouv� !");
    Exit 1;
}

# TODO read config file

while ($true) {
    log("Lecture du fichier de donn�es")

    # TODO

    log("Envoi des donn�es au serveur")

    # TODO

    log("Prochain envoi dans $sleepTime secondes")
    Start-Sleep -s $sleepTime
}
