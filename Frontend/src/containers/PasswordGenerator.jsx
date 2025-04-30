"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedCharacter from "../components/AnimatedCharacter"
import useMobile from "../hooks/useMobile"

function PasswordGenerator() {
  const [state, setState] = useState({
    password: "",
    bits: 0,
    crackTime: "",
    status: "idle",
    currentStep: 0,
  })
  const [animationComplete, setAnimationComplete] = useState(false)
  const [visibleChars, setVisibleChars] = useState(0)
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })
  const isMobile = useMobile()

  const steps = [
    {
      name: "Génération",
      description:
        "Création d'un mot de passe de 25 caractères avec caractères spéciaux, majuscules et caractères étrangers",
    },
    { name: "Vérification", description: "Vérification contre les wordlists connues (rockyou, etc.)" },
    { name: "Salage", description: "Application d'un salage unique pour garantir l'unicité" },
    { name: "Calcul de force", description: "Calcul du nombre de bits d'entropie (minimum 128 bits)" },
    { name: "Simulation", description: "Simulation du temps nécessaire pour cracker le mot de passe" },
    { name: "Test de sécurité", description: "Tentative de crackage simulée pour vérifier la résistance" },
  ]

  // Effet pour animer l'apparition des caractères de gauche à droite
  useEffect(() => {
    if (state.status === "animating" && state.password) {
      let count = 0
      const interval = setInterval(() => {
        count++
        setVisibleChars(count)
        if (count >= state.password.length) {
          clearInterval(interval)
          setTimeout(() => {
            setState((prev) => ({ ...prev, status: "complete" }))
            setAnimationComplete(true)
          }, 500)
        }
      }, 100) // Vitesse d'apparition des caractères

      return () => clearInterval(interval)
    }
  }, [state.status, state.password])

  // Fonction pour afficher un toast
  const showToast = (message, type = "info") => {
    setToast({ visible: true, message, type })
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" })
    }, 3000)
  }

  const handleGeneratePassword = async () => {
    setAnimationComplete(false)
    setVisibleChars(0)
    setState({
      password: "",
      bits: 0,
      crackTime: "",
      status: "generating",
      currentStep: 0,
    })

    // Simulate each step with timing
    for (let i = 0; i < steps.length; i++) {
      setState((prev) => ({ ...prev, currentStep: i, status: getStatusFromStep(i) }))

      // Wait for the animation to complete before moving to the next step
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    // Fonction de démonstration pour générer un mot de passe
    const generateDemoPassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ"
      let password = ""
      for (let i = 0; i < 25; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    // Fonction pour simuler un temps de craquage plus précis dans la démo
    const simulateDemoCrackTime = (bits) => {
      // Assuming a modern computer can try 10 billion (10^10) passwords per second
      const attemptsPerSecond = 10000000000

      // Calculate the number of possible combinations: 2^bits
      const combinations = Math.pow(2, bits)

      // On average, half of the combinations need to be tried
      const avgAttempts = combinations / 2

      // Calculate time in seconds
      const seconds = avgAttempts / attemptsPerSecond

      // Convert to a human-readable format with more precision
      if (seconds < 60) {
        return `${Math.round(seconds)} secondes`
      } else if (seconds < 3600) {
        return `${Math.round(seconds / 60)} minutes`
      } else if (seconds < 86400) {
        return `${Math.round(seconds / 3600)} heures`
      } else if (seconds < 604800) {
        // 7 days
        return `${Math.round(seconds / 86400)} jours`
      } else if (seconds < 2629746) {
        // ~1 month
        return `${Math.round(seconds / 604800)} semaines`
      } else if (seconds < 31556952) {
        // ~1 year
        return `${Math.round(seconds / 2629746)} mois`
      } else if (seconds < 315569520) {
        // 10 years
        const years = Math.round(seconds / 31556952)
        return `${years} ${years === 1 ? "an" : "ans"}`
      } else if (seconds < 3155695200) {
        // 100 years
        return `${Math.round(seconds / 31556952)} ans`
      } else {
        // For very large times, provide a more precise estimate
        const years = seconds / 31556952

        if (years < 1000) {
          return `${Math.round(years)} ans`
        } else if (years < 1000000) {
          return `${Math.round(years / 1000)} milliers d'années`
        } else if (years < 1000000000) {
          return `${Math.round(years / 1000000)} millions d'années`
        } else if (years < 1000000000000) {
          return `${Math.round(years / 1000000000)} milliards d'années`
        } else {
          // Compare to the age of the universe (~13.8 billion years)
          const universeAges = years / 13800000000
          return `${Math.round(universeAges)} × l'âge de l'univers`
        }
      }
    }

    try {
      // Pour la démo, nous simulons une réponse API
      // Dans un environnement réel, vous feriez un appel fetch à votre backend
      // const response = await fetch('/api/password');
      // const result = await response.json();

      // Simulation d'une réponse API pour la démo
      const bits = Math.floor(Math.random() * 50) + 130 // Entre 130 et 180 bits

      // Calculer un temps de craquage plus réaliste
      const crackTime = simulateDemoCrackTime(bits)

      const result = {
        password: generateDemoPassword(),
        bits,
        crackTime,
      }

      setState({
        password: result.password,
        bits: result.bits,
        crackTime: result.crackTime,
        status: "animating",
        currentStep: steps.length,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, status: "failed" }))
      showToast("Une erreur est survenue lors de la génération du mot de passe. Veuillez réessayer.", "error")
    }
  }

  const getStatusFromStep = (step) => {
    const statusMap = {
      0: "generating",
      1: "checking",
      2: "salting",
      3: "calculating",
      4: "simulating",
      5: "simulating",
    }
    return statusMap[step] || "idle"
  }

  const copyToClipboard = () => {
    if (state.password) {
      navigator.clipboard.writeText(state.password)
      showToast("Le mot de passe a été copié dans le presse-papier.", "success")
    }
  }

  // Rendu du mot de passe avec animation
  const renderPassword = () => {
    if (!state.password) return null

    // Ajuster la taille du texte en fonction de l'appareil
    const textSizeClass = isMobile ? "text-base" : "text-xl"

    return (
      <div
        className={`font-mono ${textSizeClass} text-center tracking-wider whitespace-nowrap overflow-x-auto py-2 px-1`}
      >
        {state.password.split("").map((char, index) => (
          <AnimatedCharacter
            key={index}
            char={char}
            delay={index * 0.05} // Délai progressif pour chaque caractère
            isComplete={animationComplete}
            isVisible={index < visibleChars}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 w-full px-4 md:px-0">
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="p-4 md:p-6 bg-[#001845]/50 border border-purple-500/30 rounded-lg backdrop-blur-sm">
        <div className="space-y-4 md:space-y-6">
          <AnimatePresence mode="wait">
            {state.status === "idle" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 md:py-8"
              >
                <button
                  onClick={handleGeneratePassword}
                  className={`bg-purple-600 hover:bg-purple-700 text-white rounded-md ${
                    isMobile ? "px-4 py-2 text-sm" : "px-8 py-6 text-lg"
                  }`}
                >
                  Générer un Mot de Passe Parfait
                </button>
              </motion.div>
            ) : state.status === "complete" || state.status === "animating" ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 md:space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="font-medium text-sm md:text-base">Mot de passe parfait généré!</span>
                </div>

                <div className="relative">
                  <div className="p-3 md:p-4 bg-[#000C24] rounded-md overflow-x-auto">{renderPassword()}</div>
                  <button
                    className={`absolute top-1 md:top-2 right-1 md:right-2 text-gray-400 hover:text-white p-1 rounded-md ${
                      !animationComplete ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={copyToClipboard}
                    disabled={!animationComplete}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm">
                  <div className="bg-[#001233] p-2 md:p-3 rounded-md">
                    <span className="text-gray-400">Bits d'entropie:</span>
                    <div className="font-bold text-base md:text-lg">{state.bits} bits</div>
                  </div>
                  <div className="bg-[#001233] p-2 md:p-3 rounded-md">
                    <span className="text-gray-400">Temps pour cracker:</span>
                    <div className="font-bold text-base md:text-lg">{state.crackTime}</div>
                  </div>
                </div>

                <button
                  className={`w-full mt-2 md:mt-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md flex items-center justify-center ${
                    state.status === "animating" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleGeneratePassword}
                  disabled={state.status === "animating"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-2`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Générer un nouveau mot de passe
                </button>
              </motion.div>
            ) : state.status === "failed" ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 md:py-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${isMobile ? "h-8 w-8" : "h-12 w-12"} text-red-500 mx-auto mb-3 md:mb-4`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg md:text-xl font-bold text-red-400">Échec de génération</h3>
                <p className="text-gray-400 mt-2 mb-3 md:mb-4 text-sm md:text-base">
                  Le mot de passe n'a pas pu être généré. Veuillez réessayer.
                </p>
                <button
                  onClick={handleGeneratePassword}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  Réessayer
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 md:py-6"
              >
                <div className="flex justify-center mb-4 md:mb-6">
                  <svg
                    className={`${isMobile ? "h-8 w-8" : "h-12 w-12"} text-purple-500 animate-spin`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-bold text-center">{steps[state.currentStep].name}</h3>
                  <p className="text-gray-400 text-center text-sm md:text-base">
                    {steps[state.currentStep].description}
                  </p>

                  <div className="w-full bg-gray-800 rounded-full h-2 md:h-2.5">
                    <motion.div
                      className="bg-purple-600 h-2 md:h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((state.currentStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="text-right text-xs md:text-sm text-gray-400">
                    Étape {state.currentStep + 1} sur {steps.length}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator
