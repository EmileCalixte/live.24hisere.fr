function GetDataFromUrl($url) {
    Log "T�l�chargement des donn�es"

    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing

    return $response.Content
}
