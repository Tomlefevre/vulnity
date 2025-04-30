// Fonction pour échapper les entrées utilisateur contre les attaques XSS
export function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return unsafe

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Fonction pour valider une URL
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// Fonction pour valider une adresse email
export function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(String(email).toLowerCase())
}

// Fonction pour valider un nom de domaine
export function isValidDomain(domain) {
  const re = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return re.test(domain)
}

// Fonction pour valider une adresse IP
export function isValidIp(ip) {
  const re = /^(\d{1,3}\.){3}\d{1,3}$/
  return re.test(ip)
}
