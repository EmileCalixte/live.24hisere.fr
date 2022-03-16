function GetDataFromUrl($url) {
    Log "Récupération des données"

    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing

    return $response.Content
}
