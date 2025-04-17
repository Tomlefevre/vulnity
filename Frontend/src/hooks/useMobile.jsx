"use client"

import { useState, useEffect } from "react"

function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Fonction pour vérifier si l'écran est de taille mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px est la breakpoint md de Tailwind
    }

    // Vérifier au chargement
    checkMobile()

    // Ajouter un écouteur d'événement pour les changements de taille d'écran
    window.addEventListener("resize", checkMobile)

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export default useMobile
