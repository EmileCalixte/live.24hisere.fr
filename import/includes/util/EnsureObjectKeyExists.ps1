function EnsureObjectKeyExists($object, $key) {
    if ($null -eq $object.$key) {
        throw "La clé $key est manquante"
    }
}
