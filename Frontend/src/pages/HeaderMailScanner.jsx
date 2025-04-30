"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"

function HeaderMailScanner() {
  const [emailHeaders, setEmailHeaders] = useState("")
  const [results, setResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const analyzeHeaders = () => {
    if (!emailHeaders) {
      setError("Veuillez coller les en-têtes d'email")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setResults(null)

    // Simuler une analyse
    setTimeout(() => {
      try {
        const analysisResults = parseEmailHeaders(emailHeaders)
        setResults(analysisResults)
      } catch (err) {
        setError("Impossible d'analyser les en-têtes. Vérifiez le format et réessayez.")
      } finally {
        setIsAnalyzing(false)
      }
    }, 1500)
  }

  const parseEmailHeaders = (headers) => {
    // Fonction simplifiée pour analyser les en-têtes d'email
    const lines = headers.split("\n")

    // Extraire les informations de base
    const extractedInfo = {
      from: extractHeaderValue(lines, "From:"),
      to: extractHeaderValue(lines, "To:"),
      subject: extractHeaderValue(lines, "Subject:"),
      date: extractHeaderValue(lines, "Date:"),
      messageId: extractHeaderValue(lines, "Message-ID:"),
      receivedChain: extractReceivedChain(lines),
      spf: extractHeaderValue(lines, "Received-SPF:"),
      dkim: extractHeaderValue(lines, "DKIM-Signature:"),
      dmarc: extractHeaderValue(lines, "DMARC:"),
      returnPath: extractHeaderValue(lines, "Return-Path:"),
      replyTo: extractHeaderValue(lines, "Reply-To:"),
      userAgent: extractHeaderValue(lines, "User-Agent:") || extractHeaderValue(lines, "X-Mailer:"),
    }

    // Analyse de sécurité
    const securityAnalysis = analyzeSecurityHeaders(extractedInfo)

    // Analyse des serveurs de relais
    const relayServers = analyzeRelayServers(extractedInfo.receivedChain)

    return {
      basicInfo: extractedInfo,
      securityAnalysis,
      relayServers,
      spam: calculateSpamScore(extractedInfo, securityAnalysis),
    }
  }

  const extractHeaderValue = (lines, headerName) => {
    const headerLine = lines.find((line) => line.trim().startsWith(headerName))
    if (!headerLine) return ""

    return headerLine.substring(headerName.length).trim()
  }

  const extractReceivedChain = (lines) => {
    const receivedLines = []
    let currentReceived = ""

    for (const line of lines) {
      if (line.trim().startsWith("Received:")) {
        if (currentReceived) {
          receivedLines.push(currentReceived)
        }
        currentReceived = line.trim()
      } else if (currentReceived && line.trim() && !line.includes(":")) {
        currentReceived += " " + line.trim()
      }
    }

    if (currentReceived) {
      receivedLines.push(currentReceived)
    }

    return receivedLines
  }

  const analyzeSecurityHeaders = (info) => {
    const analysis = {
      spfResult: "inconnu",
      dkimResult: "inconnu",
      dmarcResult: "inconnu",
      spoofingRisk: "moyen",
    }

    // Analyse SPF
    if (info.spf) {
      if (info.spf.includes("pass")) {
        analysis.spfResult = "pass"
      } else if (info.spf.includes("fail")) {
        analysis.spfResult = "fail"
      } else if (info.spf.includes("neutral")) {
        analysis.spfResult = "neutral"
      }
    }

    // Analyse DKIM
    if (info.dkim) {
      analysis.dkimResult = "pass"
    }

    // Analyse DMARC
    if (info.dmarc) {
      if (info.dmarc.includes("pass")) {
        analysis.dmarcResult = "pass"
      } else if (info.dmarc.includes("fail")) {
        analysis.dmarcResult = "fail"
      }
    }

    // Évaluation du risque de spoofing
    if (analysis.spfResult === "pass" && analysis.dkimResult === "pass" && analysis.dmarcResult === "pass") {
      analysis.spoofingRisk = "faible"
    } else if (analysis.spfResult === "fail" || analysis.dmarcResult === "fail") {
      analysis.spoofingRisk = "élevé"
    }

    return analysis
  }

  const analyzeRelayServers = (receivedChain) => {
    return receivedChain.map((received) => {
      const serverInfo = {
        server: "Inconnu",
        ip: "Inconnu",
        timestamp: "Inconnu",
      }

      // Extraire le nom du serveur
      const fromMatch = received.match(/from\s+([^\s]+)/)
      if (fromMatch) {
        serverInfo.server = fromMatch[1]
      }

      // Extraire l'adresse IP
      const ipMatch = received.match(/\[(\d+\.\d+\.\d+\.\d+)\]/)
      if (ipMatch) {
        serverInfo.ip = ipMatch[1]
      }

      // Extraire l'horodatage
      const dateMatch = received.match(/;\s*(.+)$/)
      if (dateMatch) {
        serverInfo.timestamp = dateMatch[1]
      }

      return serverInfo
    })
  }

  const calculateSpamScore = (info, security) => {
    let score = 0
    const reasons = []

    // Vérifier les résultats de sécurité
    if (security.spfResult === "fail") {
      score += 3
      reasons.push("Échec de la vérification SPF")
    } else if (security.spfResult === "neutral" || security.spfResult === "inconnu") {
      score += 1
      reasons.push("Pas de protection SPF")
    }

    if (security.dkimResult !== "pass") {
      score += 2
      reasons.push("Pas de signature DKIM")
    }

    if (security.dmarcResult !== "pass") {
      score += 2
      reasons.push("Pas de protection DMARC")
    }

    // Vérifier la cohérence des adresses
    if (info.from && info.returnPath && !info.returnPath.includes(info.from.split("@")[1])) {
      score += 3
      reasons.push("L'adresse de retour ne correspond pas à l'expéditeur")
    }

    // Vérifier la présence d'une adresse de réponse différente
    if (info.replyTo && info.from && info.replyTo !== info.from) {
      score += 2
      reasons.push("L'adresse de réponse diffère de l'expéditeur")
    }

    // Évaluer le niveau de risque
    let riskLevel = "faible"
    if (score >= 5) {
      riskLevel = "moyen"
    }
    if (score >= 8) {
      riskLevel = "élevé"
    }

    return {
      score,
      riskLevel,
      reasons,
    }
  }

  return (
    <AppLayout
      title="Mail Scanner"
      color="green"
      description="Analysez les en-têtes d'emails pour détecter les menaces et vérifier l'authenticité des messages. Identifiez les tentatives de phishing et de spoofing."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="email-headers" className="block text-sm font-medium text-gray-400 mb-2">
            En-têtes d'email
          </label>
          <textarea
            id="email-headers"
            value={emailHeaders}
            onChange={(e) => setEmailHeaders(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[200px]"
            placeholder="Collez ici les en-têtes complets de l'email à analyser..."
          />
          <p className="mt-2 text-sm text-gray-400">
            Comment trouver les en-têtes d'email ? Dans la plupart des clients de messagerie, vous pouvez afficher les
            en-têtes en sélectionnant "Afficher l'original" ou "Afficher la source" dans le menu de l'email.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">{error}</div>
        )}

        <div className="mb-6">
          <button
            onClick={analyzeHeaders}
            disabled={!emailHeaders || isAnalyzing}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition-colors ${
              !emailHeaders || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isAnalyzing ? "Analyse en cours..." : "Analyser les en-têtes"}
          </button>
        </div>

        {results && (
          <div className="mt-6 space-y-6">
            <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">De:</p>
                  <p className="text-white">{results.basicInfo.from || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">À:</p>
                  <p className="text-white">{results.basicInfo.to || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Sujet:</p>
                  <p className="text-white">{results.basicInfo.subject || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date:</p>
                  <p className="text-white">{results.basicInfo.date || "Non spécifié"}</p>
                </div>
                {results.basicInfo.returnPath && (
                  <div>
                    <p className="text-sm text-gray-400">Adresse de retour:</p>
                    <p className="text-white">{results.basicInfo.returnPath}</p>
                  </div>
                )}
                {results.basicInfo.replyTo && (
                  <div>
                    <p className="text-sm text-gray-400">Adresse de réponse:</p>
                    <p className="text-white">{results.basicInfo.replyTo}</p>
                  </div>
                )}
                {results.basicInfo.userAgent && (
                  <div>
                    <p className="text-sm text-gray-400">Client de messagerie:</p>
                    <p className="text-white">{results.basicInfo.userAgent}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Analyse de sécurité</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#1a1a2e] p-3 rounded-md">
                  <p className="text-sm text-gray-400">SPF:</p>
                  <p
                    className={`font-medium ${
                      results.securityAnalysis.spfResult === "pass"
                        ? "text-green-400"
                        : results.securityAnalysis.spfResult === "fail"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {results.securityAnalysis.spfResult === "pass"
                      ? "Validé ✓"
                      : results.securityAnalysis.spfResult === "fail"
                        ? "Échec ✗"
                        : "Non vérifié ⚠️"}
                  </p>
                </div>

                <div className="bg-[#1a1a2e] p-3 rounded-md">
                  <p className="text-sm text-gray-400">DKIM:</p>
                  <p
                    className={`font-medium ${
                      results.securityAnalysis.dkimResult === "pass" ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {results.securityAnalysis.dkimResult === "pass" ? "Validé ✓" : "Non vérifié ⚠️"}
                  </p>
                </div>

                <div className="bg-[#1a1a2e] p-3 rounded-md">
                  <p className="text-sm text-gray-400">DMARC:</p>
                  <p
                    className={`font-medium ${
                      results.securityAnalysis.dmarcResult === "pass"
                        ? "text-green-400"
                        : results.securityAnalysis.dmarcResult === "fail"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {results.securityAnalysis.dmarcResult === "pass"
                      ? "Validé ✓"
                      : results.securityAnalysis.dmarcResult === "fail"
                        ? "Échec ✗"
                        : "Non vérifié ⚠️"}
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1a2e] p-3 rounded-md">
                <p className="text-sm text-gray-400">Risque d'usurpation d'identité (spoofing):</p>
                <p
                  className={`font-medium ${
                    results.securityAnalysis.spoofingRisk === "faible"
                      ? "text-green-400"
                      : results.securityAnalysis.spoofingRisk === "moyen"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {results.securityAnalysis.spoofingRisk === "faible"
                    ? "Faible ✓"
                    : results.securityAnalysis.spoofingRisk === "moyen"
                      ? "Moyen ⚠️"
                      : "Élevé ✗"}
                </p>
              </div>
            </div>

            <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Évaluation du risque de spam</h3>

              <div className="flex items-center mb-4">
                <div className="w-full bg-[#1a1a2e] h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      results.spam.riskLevel === "faible"
                        ? "bg-green-500"
                        : results.spam.riskLevel === "moyen"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, results.spam.score * 10)}%` }}
                  ></div>
                </div>
                <span className="ml-3 font-medium text-white">{results.spam.score}/10</span>
              </div>

              <p
                className={`font-medium mb-3 ${
                  results.spam.riskLevel === "faible"
                    ? "text-green-400"
                    : results.spam.riskLevel === "moyen"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                Niveau de risque: {results.spam.riskLevel.charAt(0).toUpperCase() + results.spam.riskLevel.slice(1)}
              </p>

              {results.spam.reasons.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Raisons:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.spam.reasons.map((reason, index) => (
                      <li key={index} className="text-white text-sm">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {results.relayServers.length > 0 && (
              <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Chemin de l'email</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-purple-900/30">
                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-400">Serveur</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-400">IP</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-400">Horodatage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.relayServers.map((server, index) => (
                        <tr key={index} className="border-b border-purple-900/30">
                          <td className="py-2 px-4 text-white">{server.server}</td>
                          <td className="py-2 px-4 text-white">{server.ip}</td>
                          <td className="py-2 px-4 text-white">{server.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-green-400">À propos de l'analyse des en-têtes d'email</h3>
          <p className="text-gray-300 text-sm mb-4">
            Les en-têtes d'email contiennent des informations précieuses qui peuvent vous aider à déterminer si un email
            est légitime ou s'il s'agit d'une tentative de phishing ou de spam.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong className="text-green-400">SPF (Sender Policy Framework)</strong> - Vérifie si le serveur
                d'envoi est autorisé à envoyer des emails pour le domaine de l'expéditeur.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong className="text-green-400">DKIM (DomainKeys Identified Mail)</strong> - Vérifie si l'email a été
                signé cryptographiquement par le domaine de l'expéditeur.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong className="text-green-400">
                  DMARC (Domain-based Message Authentication, Reporting & Conformance)
                </strong>{" "}
                - Combine SPF et DKIM pour une meilleure protection contre l'usurpation d'identité.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}

export default HeaderMailScanner
