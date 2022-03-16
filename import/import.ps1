. $PSScriptRoot\includes\util\EnsureObjectKeyExists.ps1
. $PSScriptRoot\includes\util\Log.ps1

$sleepTime = 15 # In seconds
$configFilePath = "$PSScriptRoot\config.json"

Log "Lancement du script d'import automatique"
Log "Les données seront envoyées au serveur toutes les $sleepTime secondes"
Log "Arrêtez l'exécution avec Ctrl+C"

Write-Host ""

Log "Lecture du fichier de configuration : $configFilePath"

try {
    $configFileExists = Test-Path -Path $configFilePath -PathType Leaf

    if (-Not $configFileExists) {
        Log "Fichier de configuration non trouvé !" red
        Exit 1;
    }

    $config = Get-Content -Path $configFilePath | ConvertFrom-Json
} catch {
    Log "Une erreur est survenue." red
    Write-Host $_ -BackgroundColor red
    Exit;
}

try {
    EnsureObjectKeyExists $config dagFilePath
    EnsureObjectKeyExists $config importUrl
    EnsureObjectKeyExists $config secretKey
} catch {
    Log "Fichier de configuration invalide" red
    Write-Host $_ -BackgroundColor Red
    Exit;
}

$dagFilePath = $config.dagFilePath
$importUrl = $config.importUrl
$secretKey = $config.secretKey

while ($true) {
    try {
        Log "Lecture du fichier de données"

        $dagFileContent = [IO.File]::ReadAllText($dagFilePath) -replace "`r`n", "`n"

        Log "Envoi des données au serveur"

        $response = Invoke-WebRequest -Uri $importUrl -Method POST -Headers @{'content-type'='application/text'; 'secretKey'=$secretKey} -Body $dagFileContent

        if ($response.StatusCode -le 299) {
            Log "Données envoyées avec succès. Code réponse du serveur : $($response.StatusCode)" $null green
        } else {
            Log "Code réponse du serveur : $($response.StatusCode)" $null red
        }

        log("Prochain envoi dans $sleepTime secondes")
        Start-Sleep -s $sleepTime
    } catch {
        Log "Une erreur est survenue" red
        Write-Host $_ -BackgroundColor Red
        Exit;
    }
}
