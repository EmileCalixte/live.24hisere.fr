function GetDataFromFile($filePath) {
    Log "Lecture du fichier de donn�es"

    return [IO.File]::ReadAllText($filePath) -replace "`r`n", "`n"
}
