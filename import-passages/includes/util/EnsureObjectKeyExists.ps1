function EnsureObjectKeyExists($object, $key) {
    if ($null -eq $object.$key) {
        throw "La cl� $key est manquante"
    }
}
