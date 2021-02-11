function exists(value) {
    if (!value) return false
    if (Array.isArray(value) && value.length === 0) return false
    if (typeof value === 'string' && !value.trim()) return false
    return true
}

function notExists(value) {
    if(exists(value)) return false
    return true
}

function equals(valueA, valueB) {
    if (valueA !== valueB) return false
    return true
}

module.exports = { exists, notExists, equals }
