"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ShieldCheck, AlertTriangle, Copy, RefreshCw } from "lucide-react"
import { generatePassword } from "@/app/actions/password"
import { useToast } from "@/hooks/use-toast"
import AnimatedCharacter from "./animated-character"
import { useMobile } from "@/hooks/use-mobile"

export default function PasswordGenerator() {
  const [state, setState] = useState({
    password: "",
    bits: 0,
    crackTime: "",
    status: "idle",
    currentStep: 0,
  })
  const [animationComplete, setAnimationComplete] = useState(false)
  const [visibleChars, setVisibleChars] = useState(0)
  const { toast } = useToast()
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

    try {
      // Call the server action to generate the password
      const result = await generatePassword()

      setState({
        password: result.password,
        bits: result.bits,
        crackTime: result.crackTime,
        status: "animating", // Nouveau statut pour l'animation
        currentStep: steps.length,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, status: "failed" }))
      toast({
        title: "Échec de génération",
        description: "Une erreur est survenue lors de la génération du mot de passe. Veuillez réessayer.",
        variant: "destructive",
      })
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
      toast({
        title: "Copié!",
        description: "Le mot de passe a été copié dans le presse-papier.",
      })
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
      <Card className="p-4 md:p-6 bg-[#001845]/50 border-purple-500/30 backdrop-blur-sm">
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
                <Button
                  size={isMobile ? "default" : "lg"}
                  onClick={handleGeneratePassword}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-8 py-2 md:py-6 text-sm md:text-lg"
                >
                  Générer un Mot de Passe Parfait
                </Button>
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
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="font-medium text-sm md:text-base">Mot de passe parfait généré!</span>
                </div>

                <div className="relative">
                  <div className="p-3 md:p-4 bg-[#000C24] rounded-md overflow-x-auto">{renderPassword()}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 md:top-2 right-1 md:right-2 text-gray-400 hover:text-white"
                    onClick={copyToClipboard}
                    disabled={!animationComplete}
                  >
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
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

                <Button
                  className="w-full mt-2 md:mt-4 bg-purple-600 hover:bg-purple-700"
                  onClick={handleGeneratePassword}
                  disabled={state.status === "animating"}
                >
                  <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Générer un nouveau mot de passe
                </Button>
              </motion.div>
            ) : state.status === "failed" ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 md:py-6"
              >
                <AlertTriangle className="h-8 w-8 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-red-400">Échec de génération</h3>
                <p className="text-gray-400 mt-2 mb-3 md:mb-4 text-sm md:text-base">
                  Le mot de passe n'a pas pu être généré. Veuillez réessayer.
                </p>
                <Button onClick={handleGeneratePassword} className="bg-purple-600 hover:bg-purple-700">
                  Réessayer
                </Button>
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
                  <Loader2 className="h-8 w-8 md:h-12 md:w-12 text-purple-500 animate-spin" />
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
      </Card>
    </div>
  )
}
