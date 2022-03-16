. $PSScriptRoot\includes\retrieveData\GetDataFromFile.ps1
. $PSScriptRoot\includes\retrieveData\GetDataFromURl.ps1
. $PSScriptRoot\includes\util\EnsureObjectKeyExists.ps1
. $PSScriptRoot\includes\util\Log.ps1

$sleepTime = 15 # In seconds
$configFilePath = "$PSScriptRoot\config.json"

Log "Lancement du script d'import automatique"
Log "Les donn�es seront envoy�es au serveur toutes les $sleepTime secondes"
Log "Arr�tez l'ex�cution avec Ctrl+C"

Write-Host ""

Log "Lecture du fichier de configuration : $configFilePath"

try {
    $configFileExists = Test-Path -Path $configFilePath -PathType Leaf

    if (-Not $configFileExists) {
        Log "Fichier de configuration non trouv� !" red
        Exit 1;
    }

    $config = Get-Content -Path $configFilePath | ConvertFrom-Json
} catch {
    Log "Une erreur est survenue." red
    Write-Host $_ -BackgroundColor red
    Exit;
}

try {
    EnsureObjectKeyExists $config importFrom
    EnsureObjectKeyExists $config importUrl
    EnsureObjectKeyExists $config secretKey

    if ($config.importFrom -eq "file") {
        EnsureObjectKeyExists $config dagFilePath
    }
    elseif ($config.importFrom -eq "url") {
        EnsureObjectKeyExists $config dataUrl
    } else {
        throw "La cl� importFrom a une valeur incorrecte"
    }

} catch {
    Log "Une erreur est survenue lors de la lecture du fichier de configuration" red
    Write-Host $_ -BackgroundColor red
    Exit;
}

$importUrl = $config.importUrl
$secretKey = $config.secretKey

while ($true) {
    try {
        switch ($config.importFrom)
        {
            "file" { $dagFileContent = GetDataFromFile($config.dagFilePath) }
            "url" { $dagFileContent = GetDataFromURl($config.dataUrl) }
            default { throw "Invalid import method" }
        }

        Log "Envoi des donn�es au serveur"

        $response = Invoke-WebRequest -Uri $importUrl -Method POST -Headers @{'content-type'='application/text'; 'secretKey'=$secretKey} -Body $dagFileContent -UseBasicParsing

        if ($response.StatusCode -le 299) {
            Log "Donn�es envoy�es avec succ�s. Code r�ponse du serveur : $($response.StatusCode)" $null green
        } else {
            Log "Code r�ponse du serveur : $($response.StatusCode)" $null red
        }

        log("Prochain envoi dans $sleepTime secondes")
        Start-Sleep -s $sleepTime
    } catch {
        Log "Une erreur est survenue" red
        Write-Host $_ -BackgroundColor red
        Exit;
    }
}
