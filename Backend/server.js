const express = require("express")
const cors = require("cors")
const { generatePassword, reloadCommonPasswords } = require("./Routes/password")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Protection contre les attaques XSS
app.use((req, res, next) => {
  // Définir les en-têtes de sécurité
  res.setHeader("X-XSS-Protection", "1; mode=block")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("Content-Security-Policy", "default-src 'self'")
  next()
})

// Routes
app.get("/api/password", generatePassword)

// Route pour recharger la liste de mots de passe (protégée en production)
app.post("/api/reload-wordlist", (req, res) => {
  try {
    const result = reloadCommonPasswords()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Route de santé pour vérifier que le serveur fonctionne
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Le serveur fonctionne correctement" })
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})
