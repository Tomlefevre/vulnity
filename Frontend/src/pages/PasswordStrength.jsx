"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { motion } from "framer-motion"

function PasswordStrength() {
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState({
    score: 0,
    bits: 0,
    crackTime: "",
    feedback: [],
  })

  const calculateStrength = (password) => {
    // Vérifier si le mot de passe est vide
    if (!password) {
      return {
        score: 0,
        bits: 0,
        crackTime: "Instantané",
        feedback: ["Veuillez entrer un mot de passe"],
      }
    }

    // Initialiser les variables
    let score = 0
    const feedback = []

    // Vérifier la longueur
    if (password.length < 8) {
      feedback.push("Le mot de passe est trop court (minimum 8 caractères)")
    } else {
      score += Math.min(2, Math.floor(password.length / 8))
    }

    // Vérifier la présence de différents types de caractères
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    if (hasUppercase) score += 1
    else feedback.push("Ajoutez des lettres majuscules")

    if (hasLowercase) score += 1
    else feedback.push("Ajoutez des lettres minuscules")

    if (hasNumbers) score += 1
    else feedback.push("Ajoutez des chiffres")

    if (hasSpecial) score += 1
    else feedback.push("Ajoutez des caractères spéciaux")

    // Vérifier les répétitions
    const hasRepeatingChars = /(.)\1{2,}/.test(password)
    if (hasRepeatingChars) {
      score -= 1
      feedback.push("Évitez les caractères répétitifs")
    }

    // Vérifier les séquences communes
    const hasCommonSequences = /123|abc|qwerty|password|admin|user/i.test(password)
    if (hasCommonSequences) {
      score -= 1
      feedback.push("Évitez les séquences communes")
    }

    // Calculer le score final (entre 0 et 5)
    score = Math.max(0, Math.min(5, score))

    // Calculer les bits d'entropie
    let poolSize = 0
    if (hasUppercase) poolSize += 26
    if (hasLowercase) poolSize += 26
    if (hasNumbers) poolSize += 10
    if (hasSpecial) poolSize += 33

    const bits = Math.floor(password.length * Math.log2(Math.max(1, poolSize)))

    // Estimer le temps de craquage
    let crackTime = "Instantané"

    if (bits > 28) crackTime = "Quelques secondes"
    if (bits > 36) crackTime = "Quelques minutes"
    if (bits > 44) crackTime = "Quelques heures"
    if (bits > 56) crackTime = "Quelques jours"
    if (bits > 64) crackTime = "Quelques mois"
    if (bits > 80) crackTime = "Quelques années"
    if (bits > 96) crackTime = "Plusieurs siècles"
    if (bits > 128) crackTime = "Pratiquement impossible"

    // Si le score est bon mais qu'il n'y a pas de feedback, ajouter un message positif
    if (score >= 4 && feedback.length === 0) {
      feedback.push("Excellent mot de passe !")
    }

    return {
      score,
      bits,
      crackTime,
      feedback: feedback.length > 0 ? feedback : ["Mot de passe acceptable"],
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setStrength(calculateStrength(newPassword))
  }

  const getScoreColor = (score) => {
    const colors = [
      "bg-red-600", // 0 - Très faible
      "bg-red-500", // 1 - Faible
      "bg-yellow-500", // 2 - Moyen
      "bg-yellow-400", // 3 - Bon
      "bg-green-500", // 4 - Très bon
      "bg-green-400", // 5 - Excellent
    ]
    return colors[score] || colors[0]
  }

  const getScoreText = (score) => {
    const texts = ["Très faible", "Faible", "Moyen", "Bon", "Très bon", "Excellent"]
    return texts[score] || texts[0]
  }

  const getScoreTextColor = (score) => {
    const colors = [
      "text-red-600", // 0 - Très faible
      "text-red-500", // 1 - Faible
      "text-yellow-500", // 2 - Moyen
      "text-yellow-400", // 3 - Bon
      "text-green-500", // 4 - Très bon
      "text-green-400", // 5 - Excellent
    ]
    return colors[score] || colors[0]
  }

  return (
    <AppLayout
      title="Vérificateur de Force de Mot de Passe"
      color="red"
      description="Vérifiez la force de vos mots de passe et obtenez des recommandations pour les améliorer. Aucune donnée n'est envoyée à nos serveurs, tout est traité localement dans votre navigateur."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
            Entrez votre mot de passe
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Entrez votre mot de passe pour vérifier sa force"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">Force du mot de passe</span>
            <span className={`text-sm font-medium ${getScoreTextColor(strength.score)}`}>
              {getScoreText(strength.score)}
            </span>
          </div>
          <div className="w-full h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getScoreColor(strength.score)}`}
              initial={{ width: "0%" }}
              animate={{ width: `${(strength.score / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
            <h3 className="text-lg font-semibold mb-3 text-red-400">Statistiques</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-400">Bits d'entropie:</span>
                <div className="font-mono text-lg">{strength.bits} bits</div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Temps estimé pour cracker:</span>
                <div className="font-mono text-lg">{strength.crackTime}</div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Longueur:</span>
                <div className="font-mono text-lg">{password.length} caractères</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
            <h3 className="text-lg font-semibold mb-3 text-red-400">Recommandations</h3>
            <ul className="space-y-2">
              {strength.feedback.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-red-400">Conseils pour un mot de passe fort</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">Utilisez au moins 12 caractères</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">Mélangez majuscules, minuscules, chiffres et caractères spéciaux</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">Évitez les informations personnelles identifiables</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">N'utilisez pas de mots du dictionnaire sans les modifier</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">Utilisez un mot de passe unique pour chaque compte</span>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}

export default PasswordStrength
