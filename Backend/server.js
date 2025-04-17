const express = require("express")
const cors = require("cors")
const { generatePassword, reloadCommonPasswords } = require("./Routes/password")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

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

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
