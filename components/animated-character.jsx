"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Caractères possibles pour l'animation
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ"

export default function AnimatedCharacter({ char, delay, isComplete, isVisible }) {
  const [randomChars, setRandomChars] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Générer une séquence aléatoire de caractères pour l'animation
  useEffect(() => {
    if (!isVisible) return

    const sequence = []
    // Générer 10 caractères aléatoires + le caractère final
    for (let i = 0; i < 10; i++) {
      sequence.push(chars[Math.floor(Math.random() * chars.length)])
    }
    sequence.push(char) // Le dernier caractère est celui qu'on veut afficher
    setRandomChars(sequence)

    // Animation de défilement des caractères
    let index = 0
    const interval = setInterval(() => {
      setCurrentIndex(index)
      index++
      if (index >= sequence.length) {
        clearInterval(interval)
      }
    }, 50) // Vitesse de défilement des caractères

    return () => clearInterval(interval)
  }, [char, isVisible])

  if (!isVisible) {
    return null // Ne pas afficher si pas encore visible
  }

  return (
    <span className="inline-block">
      {isComplete ? (
        <span>{char}</span>
      ) : (
        <motion.span initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-center">
          {randomChars[currentIndex] || char}
        </motion.span>
      )}
    </span>
  )
}
