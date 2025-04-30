"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { escapeHtml } from "../utils/security"

function SslChecker() {
  const [domain, setDomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const checkSSL = async () => {
    if (!domain) {
      setError("Veuillez entrer un nom de domaine")
      return
    }

    // Validation simple du domaine
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      setError("Veuillez entrer un nom de domaine valide (ex: exemple.com)")
      return
    }

    setIsChecking(true)
    setError("")
    setResults(null)

    try {
      // Utiliser une API réelle pour vérifier le SSL
      const response = await fetch(
        `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(domain)}&startNew=on`,
      )

      if (!response.ok) {
        throw new Error(`Erreur lors de la vérification: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === "ERROR") {
        throw new Error(data.statusMessage || "Erreur lors de l'analyse du domaine")
      }

      if (data.status === "IN_PROGRESS" || data.status === "DNS") {
        // L'analyse est en cours, on attend quelques secondes et on vérifie à nouveau
        setTimeout(() => pollResults(domain), 5000)
        return
      }

      // Traiter les résultats
      processResults(data)
    } catch (err) {
      setError(`Erreur lors de la vérification: ${err.message}`)
      setIsChecking(false)
    }
  }

  const pollResults = async (domain) => {
    try {
      const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(domain)}`)

      if (!response.ok) {
        throw new Error(`Erreur lors de la vérification: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === "ERROR") {
        throw new Error(data.statusMessage || "Erreur lors de l'analyse du domaine")
      }

      if (data.status === "IN_PROGRESS" || data.status === "DNS") {
        // L'analyse est toujours en cours, on continue à vérifier
        setTimeout(() => pollResults(domain), 5000)
        return
      }

      // Traiter les résultats
      processResults(data)
    } catch (err) {
      setError(`Erreur lors de la vérification: ${err.message}`)
      setIsChecking(false)
    }
  }

  const processResults = (data) => {
    // Extraire les informations pertinentes des résultats
    const endpoint = data.endpoints && data.endpoints[0]

    if (!endpoint) {
      setError("Aucune information disponible pour ce domaine")
      setIsChecking(false)
      return
    }

    const grade = endpoint.grade || "N/A"
    const hasWarnings = endpoint.hasWarnings || false
    const protocols = endpoint.details?.protocols || []
    const cert = endpoint.details?.cert || {}

    // Calculer un score sur 100 basé sur le grade
    let score = 0
    if (grade === "A+") score = 100
    else if (grade === "A") score = 90
    else if (grade === "A-") score = 85
    else if (grade === "B") score = 75
    else if (grade === "C") score = 65
    else if (grade === "D") score = 55
    else if (grade === "E") score = 45
    else if (grade === "F") score = 35
    else score = 25

    // Déterminer le niveau de risque
    let riskLevel = "sûr"
    if (score < 80) riskLevel = "suspect"
    if (score < 70) riskLevel = "dangereux"
    if (score < 50) riskLevel = "très dangereux"

    // Construire l'objet de résultats
    const results = {
      domain,
      grade,
      score,
      riskLevel,
      hasWarnings,
      protocols: protocols.map((p) => `${p.name} ${p.version}`),
      validFrom: cert.notBefore ? new Date(cert.notBefore).toLocaleDateString() : "N/A",
      validTo: cert.notAfter ? new Date(cert.notAfter).toLocaleDateString() : "N/A",
      issuer: cert.issuerLabel || "N/A",
      vulnerabilities: [],
    }

    // Ajouter les vulnérabilités connues
    if (endpoint.details?.vulnBeast) results.vulnerabilities.push("BEAST")
    if (endpoint.details?.vulnHeartbleed) results.vulnerabilities.push("HEARTBLEED")
    if (endpoint.details?.vulnPoodle) results.vulnerabilities.push("POODLE")
    if (endpoint.details?.vulnFreak) results.vulnerabilities.push("FREAK")
    if (endpoint.details?.vulnLogjam) results.vulnerabilities.push("LOGJAM")
    if (endpoint.details?.vulnDrown) results.vulnerabilities.push("DROWN")

    setResults(results)
    setIsChecking(false)
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "sûr":
        return "text-green-400"
      case "suspect":
        return "text-yellow-400"
      case "dangereux":
        return "text-orange-400"
      case "très dangereux":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-green-500"
    if (grade.startsWith("B")) return "bg-yellow-500"
    if (grade.startsWith("C")) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <AppLayout
      title="Vérificateur SSL/TLS"
      description="Vérifiez la configuration SSL/TLS de votre site web pour garantir une connexion sécurisée et identifier les vulnérabilités potentielles."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="domain" className="block text-sm font-medium text-gray-400 mb-2">
            Nom de domaine
          </label>
          <div className="flex">
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(escapeHtml(e.target.value))}
              className="flex-1 bg-[#0f0f1a] border border-purple-900/30 rounded-l-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="exemple.com"
            />
            <button
              onClick={checkSSL}
              disabled={!domain || isChecking}
              className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-md transition-colors ${
                !domain || isChecking ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isChecking ? "Vérification..." : "Vérifier"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        {isChecking && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-purple-400">Analyse SSL en cours... Cela peut prendre jusqu'à 2 minutes.</p>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-purple-900/30">
              <div>
                <h3 className="text-xl font-bold text-white">{results.domain}</h3>
                <p className="text-gray-400 text-sm mt-1">Résultats de l'analyse SSL/TLS</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div
                  className={`${getGradeColor(results.grade)} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {results.grade}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Score global</p>
                  <p className={`text-xl font-bold ${getRiskColor(results.riskLevel)}`}>{results.score}/100</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">Informations du certificat</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Émetteur</p>
                    <p className="text-white">{results.issuer}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">Valide depuis</p>
                      <p className="text-white">{results.validFrom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Valide jusqu'au</p>
                      <p className="text-white">{results.validTo}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">Protocoles supportés</h4>
                <div className="grid grid-cols-2 gap-2">
                  {results.protocols.map((protocol, index) => (
                    <div key={index} className="bg-[#1a1a2e] p-2 rounded border border-purple-900/30">
                      <p className="text-white">{protocol}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {results.vulnerabilities.length > 0 && (
              <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-md p-4">
                <h4 className="text-lg font-semibold mb-3 text-red-400">Vulnérabilités détectées</h4>
                <div className="space-y-3">
                  {results.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-400 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-white font-medium">{vuln}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {vuln === "POODLE" &&
                            "Vulnérabilité permettant de déchiffrer le contenu des connexions sécurisées utilisant le protocole SSL 3.0"}
                          {vuln === "BEAST" &&
                            "Vulnérabilité dans les implémentations TLS 1.0 permettant de récupérer des informations sensibles"}
                          {vuln === "HEARTBLEED" &&
                            "Vulnérabilité critique permettant de lire la mémoire d'un serveur ou d'un client utilisant OpenSSL"}
                          {vuln === "FREAK" &&
                            "Vulnérabilité permettant de forcer l'utilisation d'un chiffrement faible"}
                          {vuln === "LOGJAM" &&
                            "Vulnérabilité permettant de dégrader la connexion vers un chiffrement faible"}
                          {vuln === "DROWN" &&
                            "Vulnérabilité permettant de déchiffrer les sessions TLS en exploitant SSLv2"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h4 className="text-lg font-semibold mb-3 text-purple-400">Recommandations</h4>
              <ul className="space-y-2">
                {results.grade !== "A+" && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-gray-300">Améliorez votre configuration SSL pour atteindre un grade A+</span>
                  </li>
                )}
                {results.vulnerabilities.length > 0 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-gray-300">
                      Corrigez les vulnérabilités détectées en mettant à jour votre serveur web
                    </span>
                  </li>
                )}
                {results.protocols.some((p) => p.includes("TLS 1.0") || p.includes("TLS 1.1")) && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-gray-300">Désactivez les protocoles obsolètes (TLS 1.0 et TLS 1.1)</span>
                  </li>
                )}
                {!results.protocols.some((p) => p.includes("TLS 1.3")) && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-gray-300">
                      Activez TLS 1.3 pour une sécurité et des performances optimales
                    </span>
                  </li>
                )}
                {results.grade === "A+" && results.vulnerabilities.length === 0 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-green-400">
                      Votre configuration SSL/TLS est excellente ! Continuez à la maintenir à jour.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default SslChecker
