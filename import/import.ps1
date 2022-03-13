$sleepTime = 15 # In seconds
$scriptPath = $MyInvocation.MyCommand.Path
$scriptParentDir = Split-Path -Path $scriptPath -Parent
$configFilePath = "$scriptParentDir\config.json"

function log($string, $backgroundColor, $foregroundColor) {
    $time = Get-Date -Format "HH:mm:ss"

    if ($null -eq $backgroundColor -and $null -eq $foregroundColor) {
        Write-Host "[$time] $string"
        return
    }

    if ($null -eq $backgroundColor) {
        Write-Host "[$time] $string" -ForegroundColor $foregroundColor
        return
    }

    if ($null -eq $foregroundColor) {
        Write-Host "[$time] $string" -BackgroundColor $backgroundColor
        return
    }

    Write-Host "[$time] $string" -BackgroundColor $backgroundColor -ForegroundColor $foregroundColor
}

log $scriptParentDir

log "Lancement du script d'import automatique"
log "Les donn�es seront envoy�es au serveur toutes les $sleepTime secondes"
log "Arr�tez l'ex�cution avec Ctrl+C"

Write-Host ""

log "Lecture du fichier de configuration : $configFilePath"

$configFileExists = Test-Path -Path $configFilePath -PathType Leaf

if (-Not $configFileExists) {
    log "Fichier de configuration non trouv� !" red
    Exit 1;
}

# TODO read config file

while ($true) {
    log "Lecture du fichier de donn�es"

    # TODO

    log "Envoi des donn�es au serveur"

    # TODO

    log "Donn�es envoy�es avec succ�s" $null green

    log("Prochain envoi dans $sleepTime secondes")
    Start-Sleep -s $sleepTime
}
