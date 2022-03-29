function GetDataFromUrl($url) {
    Log "Téléchargement des données"

    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing

    return $response.Content
}
