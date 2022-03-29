function GetDataFromFile($filePath) {
    Log "Lecture du fichier de données"

    return [IO.File]::ReadAllText($filePath) -replace "`r`n", "`n"
}
