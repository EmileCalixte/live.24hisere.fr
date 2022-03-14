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

function ensureObjectKeyExists($object, $key) {
    if ($null -eq $object.$key) {
        throw "La cl� $key est manquante"
    }
}

log $scriptParentDir

log "Lancement du script d'import automatique"
log "Les donn�es seront envoy�es au serveur toutes les $sleepTime secondes"
log "Arr�tez l'ex�cution avec Ctrl+C"

Write-Host ""

log "Lecture du fichier de configuration : $configFilePath"

try {
    $configFileExists = Test-Path -Path $configFilePath -PathType Leaf

    if (-Not $configFileExists) {
        log "Fichier de configuration non trouv� !" red
        Exit 1;
    }

    $config = Get-Content -Path $configFilePath | ConvertFrom-Json
} catch {
    log "Une erreur est survenue." red
    Write-Host $_ -BackgroundColor red
    Exit;
}

try {
    ensureObjectKeyExists $config dagFilePath
    ensureObjectKeyExists $config importUrl
    ensureObjectKeyExists $config secretKey
} catch {
    log "Fichier de configuration invalide" red
    Write-Host $_ -BackgroundColor Red
    Exit;
}

$dagFilePath = $config.dagFilePath
$importUrl = $config.importUrl
$secretKey = $config.secretKey

while ($true) {
    try {
        log "Lecture du fichier de donn�es"

        $dagFileContent = [IO.File]::ReadAllText($dagFilePath) -replace "`r`n", "`n"

        log "Envoi des donn�es au serveur"

        $response = Invoke-WebRequest -Uri $importUrl -Method POST -Headers @{'content-type'='application/text'; 'secretKey'=$secretKey} -Body $dagFileContent

        if ($response.StatusCode -le 299) {
            log "Donn�es envoy�es avec succ�s. Code r�ponse du serveur : $($response.StatusCode)" $null green
        } else {
            log "Code r�ponse du serveur : $($response.StatusCode)" $null red
        }

        log("Prochain envoi dans $sleepTime secondes")
        Start-Sleep -s $sleepTime
    } catch {
        log "Une erreur est survenue" red
        Write-Host $_ -BackgroundColor Red
        Exit;
    }
}
