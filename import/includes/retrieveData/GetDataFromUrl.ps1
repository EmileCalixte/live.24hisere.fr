function GetDataFromUrl($url) {
    Log "R�cup�ration des donn�es"

    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing

    return $response.Content
}
