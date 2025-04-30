"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"

function UrlScan() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const scanUrl = async () => {
    if (!url) {
      setError("Veuillez entrer une URL")
      return
    }

    // Validation simple de l'URL
    try {
      new URL(url)
    } catch (e) {
      setError("Veuillez entrer une URL valide (ex: https://exemple.com)")
      return
    }

    setIsScanning(true)
    setError("")
    setResults(null)

    try {
      // Simuler une analyse d'URL (dans une application réelle, appelez une API)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Générer des résultats de démonstration
      const demoResults = generateDemoResults(url)
      setResults(demoResults)
    } catch (err) {
      setError(`Erreur lors de l'analyse: ${err.message}`)
    } finally {
      setIsScanning(false)
    }
  }

  // Fonction pour générer des résultats de démonstration
  const generateDemoResults = (url) => {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Générer un score de risque aléatoire entre 0 et 100
    const riskScore = Math.floor(Math.random() * 101)

    // Déterminer le niveau de risque en fonction du score
    let riskLevel
    if (riskScore < 20) riskLevel = "sûr"
    else if (riskScore < 50) riskLevel = "suspect"
    else if (riskScore < 80) riskLevel = "dangereux"
    else riskLevel = "très dangereux"

    // Générer des catégories de risque aléatoires
    const possibleCategories = [
      "Phishing",
      "Malware",
      "Spam",
      "Fraude",
      "Contenu pour adultes",
      "Cryptomining",
      "Publicité agressive",
      "Tracking",
    ]

    const categories = []
    if (riskScore > 20) {
      const numCategories = Math.floor(riskScore / 20)
      for (let i = 0; i < numCategories; i++) {
        const randomIndex = Math.floor(Math.random() * possibleCategories.length)
        const category = possibleCategories.splice(randomIndex, 1)[0]
        categories.push(category)
      }
    }

    // Générer des informations sur le domaine
    const domainInfo = {
      registrar: "Example Registrar, Inc.",
      creationDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nameservers: ["ns1.example.com", "ns2.example.com"],
      ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
        Math.random() * 256,
      )}.${Math.floor(Math.random() * 256)}`,
      location: "États-Unis",
      ssl: Math.random() > 0.3,
    }

    // Générer des technologies détectées
    const possibleTechnologies = [
      "WordPress",
      "Google Analytics",
      "jQuery",
      "Bootstrap",
      "React",
      "Angular",
      "PHP",
      "Nginx",
      "Apache",
      "Cloudflare",
      "Font Awesome",
      "Google Tag Manager",
      "Google Fonts",
    ]

    const technologies = []
    const numTechnologies = Math.floor(Math.random() * 8) + 1
    for (let i = 0; i < numTechnologies; i++) {
      const randomIndex = Math.floor(Math.random() * possibleTechnologies.length)
      const technology = possibleTechnologies.splice(randomIndex, 1)[0]
      technologies.push(technology)
    }

    // Générer des redirections
    const redirects = []
    if (Math.random() > 0.7) {
      const numRedirects = Math.floor(Math.random() * 3) + 1
      let currentUrl = url
      for (let i = 0; i < numRedirects; i++) {
        const newUrl = `https://redirect${i + 1}.example.com/path${i + 1}`
        redirects.push({
          from: currentUrl,
          to: newUrl,
          statusCode: [301, 302, 307][Math.floor(Math.random() * 3)],
        })
        currentUrl = newUrl
      }
    }

    return {
      url,
      domain,
      riskScore,
      riskLevel,
      categories,
      domainInfo,
      technologies,
      redirects,
      screenshot: "https://via.placeholder.com/800x600?text=Screenshot+Preview",
    }
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

  const getRiskBgColor = (riskLevel) => {
    switch (riskLevel) {
      case "sûr":
        return "bg-green-500"
      case "suspect":
        return "bg-yellow-500"
      case "dangereux":
        return "bg-orange-500"
      case "très dangereux":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <AppLayout
      title="URL Scan"
      color="yellow"
      description="Analysez les URLs pour détecter les sites malveillants et les tentatives de phishing. Vérifiez la sécurité d'un lien avant de le visiter."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-2">
            URL à analyser
          </label>
          <div className="flex">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#0f0f1a] border border-purple-900/30 rounded-l-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="https://exemple.com"
            />
            <button
              onClick={scanUrl}
              disabled={!url || isScanning}
              className={`bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-r-md transition-colors ${
                !url || isScanning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isScanning ? "Analyse..." : "Analyser"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        {isScanning && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-purple-900/30">
              <div>
                <h3 className="text-xl font-bold text-white">{results.domain}</h3>
                <p className="text-gray-400 text-sm mt-1 break-all">{results.url}</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div
                  className={`${getRiskBgColor(results.riskLevel)} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {results.riskScore}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Niveau de risque</p>
                  <p className={`text-xl font-bold ${getRiskColor(results.riskLevel)}`}>
                    {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30 mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-yellow-400">Informations sur le domaine</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Adresse IP:</p>
                      <p className="text-white">{results.domainInfo.ip}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Localisation:</p>
                      <p className="text-white">{results.domainInfo.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Registrar:</p>
                      <p className="text-white">{results.domainInfo.registrar}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-400">Date de création:</p>
                        <p className="text-white">{results.domainInfo.creationDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date d'expiration:</p>
                        <p className="text-white">{results.domainInfo.expiryDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">SSL:</p>
                      <p className={`font-medium ${results.domainInfo.ssl ? "text-green-400" : "text-red-400"}`}>
                        {results.domainInfo.ssl ? "Sécurisé (HTTPS)" : "Non sécurisé (HTTP)"}
                      </p>
                    </div>
                  </div>
                </div>

                {results.categories.length > 0 && (
                  <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-400">Catégories de risque détectées</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {results.technologies.length > 0 && (
                  <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30 mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-400">Technologies détectées</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results.redirects.length > 0 && (
                  <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-400">Redirections détectées</h4>
                    <div className="space-y-3">
                      {results.redirects.map((redirect, index) => (
                        <div key={index} className="bg-[#1a1a2e] p-3 rounded-md">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-400 truncate">{redirect.from}</span>
                            <span className="mx-2 text-yellow-400">→</span>
                            <span className="text-gray-400 truncate">{redirect.to}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">Code HTTP: {redirect.statusCode}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h4 className="text-lg font-semibold mb-3 text-yellow-400">Aperçu du site</h4>
              <div className="bg-white rounded-md overflow-hidden">
                <img src={results.screenshot || "/placeholder.svg"} alt="Aperçu du site" className="w-full h-auto" />
              </div>
              <p className="mt-2 text-sm text-gray-400 text-center">Aperçu du site (simulé pour cette démonstration)</p>
            </div>

            <div className="mt-6 bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
              <h4 className="text-lg font-semibold mb-3 text-yellow-400">Recommandations</h4>
              {results.riskLevel === "sûr" ? (
                <p className="text-green-400">
                  Cette URL semble sûre. Vous pouvez la visiter, mais restez toujours vigilant.
                </p>
              ) : (
                <ul className="space-y-2">
                  {results.riskLevel === "suspect" && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-yellow-400">
                        Cette URL est suspecte. Procédez avec prudence et ne partagez pas d'informations sensibles.
                      </span>
                    </li>
                  )}
                  {results.riskLevel === "dangereux" && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-orange-400">
                        Cette URL est dangereuse. Nous vous déconseillons fortement de la visiter.
                      </span>
                    </li>
                  )}
                  {results.riskLevel === "très dangereux" && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-red-400">
                        Cette URL est très dangereuse. Ne la visitez pas et ne la partagez pas.
                      </span>
                    </li>
                  )}
                  {results.categories.includes("Phishing") && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-white">
                        Ce site pourrait tenter de voler vos informations personnelles ou vos identifiants.
                      </span>
                    </li>
                  )}
                  {results.categories.includes("Malware") && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-white">
                        Ce site pourrait tenter d'installer des logiciels malveillants sur votre appareil.
                      </span>
                    </li>
                  )}
                  {!results.domainInfo.ssl && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-white">
                        Ce site n'utilise pas de connexion sécurisée (HTTPS), vos données pourraient être interceptées.
                      </span>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">À propos de l'analyse d'URL</h3>
          <p className="text-gray-300 text-sm mb-4">
            L'analyse d'URL vous permet de vérifier si un site web est potentiellement dangereux avant de le visiter.
            Cette analyse examine plusieurs facteurs de sécurité :
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Réputation du domaine et de l'adresse IP</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Présence dans des listes noires de sites malveillants</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Certificat SSL et sécurité de la connexion</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Redirections suspectes et techniques de masquage d'URL</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contenu malveillant et scripts dangereux</span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
            <p className="text-yellow-300 text-sm">
              <strong>Note :</strong> Cette démonstration simule une analyse d'URL à des fins éducatives. Pour une
              analyse complète, utilisez des outils spécialisés ou des services professionnels.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default UrlScan
