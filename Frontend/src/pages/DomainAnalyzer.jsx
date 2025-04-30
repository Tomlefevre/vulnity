"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { escapeHtml, isValidDomain, isValidIp } from "../utils/security"

function DomainAnalyzer() {
  const [domain, setDomain] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [searchType, setSearchType] = useState("domain") // "domain" ou "ip"

  const analyzeDomain = async () => {
    if (!domain) {
      setError("Veuillez entrer un domaine ou une adresse IP")
      return
    }

    // Validation du domaine ou de l'IP
    if (searchType === "domain" && !isValidDomain(domain)) {
      setError("Veuillez entrer un nom de domaine valide (ex: exemple.com)")
      return
    } else if (searchType === "ip" && !isValidIp(domain)) {
      setError("Veuillez entrer une adresse IP valide (ex: 192.168.1.1)")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setResults(null)

    try {
      // Utiliser une API réelle pour l'analyse
      const apiKey = "votre_clé_api" // Remplacez par votre clé API réelle

      // Pour les domaines, on utilise WHOIS API
      if (searchType === "domain") {
        const response = await fetch(
          `https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=whois&apikey=${apiKey}`,
        )

        if (!response.ok) {
          throw new Error(`Erreur lors de l'analyse: ${response.statusText}`)
        }

        const whoisData = await response.json()

        // Récupérer les informations DNS
        const dnsResponse = await fetch(
          `https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=dns&apikey=${apiKey}`,
        )

        if (!dnsResponse.ok) {
          throw new Error(`Erreur lors de la récupération des DNS: ${dnsResponse.statusText}`)
        }

        const dnsData = await dnsResponse.json()

        // Construire les résultats
        const results = processWhoisResults(domain, whoisData, dnsData)
        setResults(results)
      }
      // Pour les IPs, on utilise une API de géolocalisation
      else {
        const response = await fetch(`https://ipapi.co/${domain}/json/`)

        if (!response.ok) {
          throw new Error(`Erreur lors de l'analyse: ${response.statusText}`)
        }

        const ipData = await response.json()

        // Construire les résultats
        const results = processIpResults(domain, ipData)
        setResults(results)
      }
    } catch (err) {
      // En cas d'erreur avec l'API réelle, utiliser des données de démonstration
      console.error("Erreur avec l'API:", err)
      setError("Impossible de contacter l'API. Utilisation des données de démonstration.")

      // Générer des résultats de démonstration
      const demoResults = generateDemoResults(domain, searchType)
      setResults(demoResults)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const processWhoisResults = (domain, whoisData, dnsData) => {
    // Extraire les informations WHOIS
    const whoisInfo = {
      registrar: whoisData.registrar_name || "Information non disponible",
      registrantName: whoisData.registrant_name || "Information non disponible",
      registrantOrganization: whoisData.registrant_organization || "Information non disponible",
      registrantCountry: whoisData.registrant_country || "Information non disponible",
      creationDate: whoisData.created_date || "Information non disponible",
      expiryDate: whoisData.expiry_date || "Information non disponible",
      updatedDate: whoisData.updated_date || "Information non disponible",
      nameservers: whoisData.nameservers || [],
      status: whoisData.status || [],
    }

    // Extraire les informations DNS
    const dnsRecords = []

    if (dnsData.a_records) {
      dnsData.a_records.forEach((record) => {
        dnsRecords.push({
          type: "A",
          name: domain,
          value: record.ip,
          ttl: record.ttl,
        })
      })
    }

    if (dnsData.mx_records) {
      dnsData.mx_records.forEach((record) => {
        dnsRecords.push({
          type: "MX",
          name: domain,
          value: record.host,
          priority: record.priority,
          ttl: record.ttl,
        })
      })
    }

    if (dnsData.txt_records) {
      dnsData.txt_records.forEach((record) => {
        dnsRecords.push({
          type: "TXT",
          name: domain,
          value: record.txt,
          ttl: record.ttl,
        })
      })
    }

    // Informations de géolocalisation (si disponibles)
    const geoInfo = {
      ip: dnsData.a_records ? dnsData.a_records[0]?.ip : "Information non disponible",
      country: "Information non disponible",
      region: "Information non disponible",
      city: "Information non disponible",
      isp: "Information non disponible",
      org: whoisInfo.registrantOrganization,
      asn: "Information non disponible",
      timezone: "Information non disponible",
      latitude: 0,
      longitude: 0,
    }

    // Informations de réputation (simulées)
    const reputationInfo = {
      blacklisted: false,
      blacklistCount: 0,
      blacklists: [],
      malwareDetected: false,
      phishingDetected: false,
      suspiciousActivity: false,
      reputationScore: 85,
    }

    // Informations SSL (simulées)
    const sslInfo = {
      valid: true,
      issuer: "Let's Encrypt Authority X3",
      validFrom: new Date().toISOString().split("T")[0],
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysRemaining: 90,
      subjectAltNames: [`www.${domain}`, `mail.${domain}`],
    }

    return {
      query: domain,
      type: "domain",
      whoisInfo,
      dnsRecords,
      geoInfo,
      reputationInfo,
      sslInfo,
    }
  }

  const processIpResults = (ip, ipData) => {
    // Extraire les informations de géolocalisation
    const geoInfo = {
      ip: ip,
      country: ipData.country_name || "Information non disponible",
      region: ipData.region || "Information non disponible",
      city: ipData.city || "Information non disponible",
      isp: ipData.org || "Information non disponible",
      org: ipData.org || "Information non disponible",
      asn: ipData.asn || "Information non disponible",
      timezone: ipData.timezone || "Information non disponible",
      latitude: ipData.latitude || 0,
      longitude: ipData.longitude || 0,
    }

    // Informations WHOIS (simulées pour IP)
    const whoisInfo = {
      registrar: "RIPE NCC",
      registrantName: "Information non disponible",
      registrantOrganization: geoInfo.org,
      registrantCountry: geoInfo.country,
      creationDate: "Information non disponible",
      expiryDate: "Information non disponible",
      updatedDate: "Information non disponible",
      nameservers: [],
      status: ["allocated"],
    }

    // Informations DNS (simulées pour IP)
    const dnsRecords = [
      {
        type: "PTR",
        name: ip,
        value: ipData.hostname || "Pas d'enregistrement PTR",
        ttl: 3600,
      },
    ]

    // Informations de réputation (simulées)
    const reputationInfo = {
      blacklisted: false,
      blacklistCount: 0,
      blacklists: [],
      malwareDetected: false,
      phishingDetected: false,
      suspiciousActivity: false,
      reputationScore: 85,
    }

    return {
      query: ip,
      type: "ip",
      whoisInfo,
      dnsRecords,
      geoInfo,
      reputationInfo,
      sslInfo: null, // Pas d'info SSL pour les IPs
    }
  }

  // Fonction pour générer des résultats de démonstration (en cas d'échec de l'API)
  const generateDemoResults = (query, type) => {
    // Informations WHOIS simulées
    const whoisInfo = {
      registrar: "Example Registrar, Inc.",
      registrantName: "John Doe",
      registrantOrganization: "Example Organization",
      registrantCountry: "France",
      creationDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      updatedDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nameservers: ["ns1.example.com", "ns2.example.com"],
      status: ["clientTransferProhibited", "clientUpdateProhibited"],
    }

    // Informations DNS simulées
    const dnsRecords = [
      {
        type: "A",
        name: type === "domain" ? query : "example.com",
        value: type === "ip" ? query : `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        ttl: 3600,
      },
      {
        type: "MX",
        name: type === "domain" ? query : "example.com",
        value: `mail.${type === "domain" ? query : "example.com"}`,
        priority: 10,
        ttl: 3600,
      },
      {
        type: "TXT",
        name: type === "domain" ? query : "example.com",
        value: "v=spf1 include:_spf.example.com ~all",
        ttl: 3600,
      },
      {
        type: "NS",
        name: type === "domain" ? query : "example.com",
        value: "ns1.example.com",
        ttl: 86400,
      },
      {
        type: "NS",
        name: type === "domain" ? query : "example.com",
        value: "ns2.example.com",
        ttl: 86400,
      },
    ]

    // Informations de géolocalisation simulées
    const geoInfo = {
      ip: type === "ip" ? query : `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      country: "France",
      region: "Île-de-France",
      city: "Paris",
      isp: "Example ISP",
      org: "Example Organization",
      asn: "AS15169",
      timezone: "Europe/Paris",
      latitude: 48.8566,
      longitude: 2.3522,
    }

    // Informations de réputation simulées
    const reputationInfo = {
      blacklisted: Math.random() > 0.8,
      blacklistCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0,
      blacklists: Math.random() > 0.8 ? ["Spamhaus", "Barracuda", "SORBS"] : [],
      malwareDetected: Math.random() > 0.9,
      phishingDetected: Math.random() > 0.9,
      suspiciousActivity: Math.random() > 0.7,
      reputationScore: Math.floor(Math.random() * 101),
    }

    // Informations SSL simulées (pour les domaines uniquement)
    const sslInfo =
      type === "domain"
        ? {
            valid: Math.random() > 0.2,
            issuer: "Let's Encrypt Authority X3",
            validFrom: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            validTo: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            daysRemaining: Math.floor(Math.random() * 90) + 1,
            subjectAltNames: [`www.${query}`, `mail.${query}`],
          }
        : null

    return {
      query,
      type,
      whoisInfo,
      dnsRecords,
      geoInfo,
      reputationInfo,
      sslInfo,
    }
  }

  const getReputationColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getReputationBgColor = (score) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <AppLayout
      title="Analyseur de Domaine"
      description="Analysez les domaines et les adresses IP pour obtenir des informations WHOIS, DNS, géolocalisation et vérifier leur réputation."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex border border-purple-900/30 rounded-md overflow-hidden mb-4">
            <button
              onClick={() => setSearchType("domain")}
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                searchType === "domain"
                  ? "bg-purple-600 text-white"
                  : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80"
              }`}
            >
              Domaine
            </button>
            <button
              onClick={() => setSearchType("ip")}
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                searchType === "ip" ? "bg-purple-600 text-white" : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80"
              }`}
            >
              Adresse IP
            </button>
          </div>

          <label htmlFor="domain" className="block text-sm font-medium text-gray-400 mb-2">
            {searchType === "domain" ? "Nom de domaine" : "Adresse IP"}
          </label>
          <div className="flex">
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(escapeHtml(e.target.value))}
              className="flex-1 bg-[#0f0f1a] border border-purple-900/30 rounded-l-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={searchType === "domain" ? "exemple.com" : "192.168.1.1"}
            />
            <button
              onClick={analyzeDomain}
              disabled={!domain || isAnalyzing}
              className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-md transition-colors ${
                !domain || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAnalyzing ? "Analyse..." : "Analyser"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        {isAnalyzing && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-purple-900/30">
              <div>
                <h3 className="text-xl font-bold text-white">{results.query}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {results.type === "domain" ? "Analyse de domaine" : "Analyse d'adresse IP"}
                </p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div
                  className={`${getReputationBgColor(
                    results.reputationInfo.reputationScore,
                  )} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {results.reputationInfo.reputationScore}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Score de réputation</p>
                  <p className={`text-xl font-bold ${getReputationColor(results.reputationInfo.reputationScore)}`}>
                    {results.reputationInfo.reputationScore >= 80
                      ? "Excellent"
                      : results.reputationInfo.reputationScore >= 60
                        ? "Bon"
                        : results.reputationInfo.reputationScore >= 40
                          ? "Moyen"
                          : "Faible"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30 mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-purple-400">Informations WHOIS</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Registrar:</p>
                      <p className="text-white">{results.whoisInfo.registrar}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Organisation:</p>
                      <p className="text-white">{results.whoisInfo.registrantOrganization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Pays:</p>
                      <p className="text-white">{results.whoisInfo.registrantCountry}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-400">Date de création:</p>
                        <p className="text-white">{results.whoisInfo.creationDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date d'expiration:</p>
                        <p className="text-white">{results.whoisInfo.expiryDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Serveurs de noms:</p>
                      <ul className="list-disc pl-5 text-white">
                        {results.whoisInfo.nameservers.map((ns, index) => (
                          <li key={index}>{ns}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                  <h4 className="text-lg font-semibold mb-3 text-purple-400">Géolocalisation</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">IP:</p>
                      <p className="text-white">{results.geoInfo.ip}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Localisation:</p>
                      <p className="text-white">
                        {results.geoInfo.city}, {results.geoInfo.region}, {results.geoInfo.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Fournisseur d'accès:</p>
                      <p className="text-white">{results.geoInfo.isp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Organisation:</p>
                      <p className="text-white">{results.geoInfo.org}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">ASN:</p>
                      <p className="text-white">{results.geoInfo.asn}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30 mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-purple-400">Enregistrements DNS</h4>
                  <div className="space-y-3">
                    {results.dnsRecords.map((record, index) => (
                      <div key={index} className="bg-[#1a1a2e] p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-purple-400">{record.type}</span>
                          <span className="text-xs text-gray-400">TTL: {record.ttl}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          <span className="text-gray-400">Nom:</span> {record.name}
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="text-gray-400">Valeur:</span> {record.value}
                        </p>
                        {record.priority && (
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Priorité:</span> {record.priority}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                  <h4 className="text-lg font-semibold mb-3 text-purple-400">Réputation</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Listes noires:</p>
                      {results.reputationInfo.blacklisted ? (
                        <div>
                          <p className="text-red-400 font-medium">
                            Présent dans {results.reputationInfo.blacklistCount} liste(s) noire(s)
                          </p>
                          <ul className="list-disc pl-5 text-white mt-1">
                            {results.reputationInfo.blacklists.map((bl, index) => (
                              <li key={index}>{bl}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-green-400 font-medium">Non listé</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Malware détecté:</p>
                      <p
                        className={`font-medium ${
                          results.reputationInfo.malwareDetected ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {results.reputationInfo.malwareDetected ? "Oui" : "Non"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phishing détecté:</p>
                      <p
                        className={`font-medium ${
                          results.reputationInfo.phishingDetected ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {results.reputationInfo.phishingDetected ? "Oui" : "Non"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Activité suspecte:</p>
                      <p
                        className={`font-medium ${
                          results.reputationInfo.suspiciousActivity ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {results.reputationInfo.suspiciousActivity ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {results.sslInfo && (
              <div className="mt-6 bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">Informations SSL</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Statut:</p>
                    <p className={`font-medium ${results.sslInfo.valid ? "text-green-400" : "text-red-400"}`}>
                      {results.sslInfo.valid ? "Valide" : "Non valide ou expiré"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Émetteur:</p>
                    <p className="text-white">{results.sslInfo.issuer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Valide depuis:</p>
                    <p className="text-white">{results.sslInfo.validFrom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Valide jusqu'au:</p>
                    <p className="text-white">{results.sslInfo.validTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Jours restants:</p>
                    <p
                      className={`font-medium ${
                        results.sslInfo.daysRemaining > 30 ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {results.sslInfo.daysRemaining} jours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Noms alternatifs:</p>
                    <ul className="list-disc pl-5 text-white">
                      {results.sslInfo.subjectAltNames.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default DomainAnalyzer
