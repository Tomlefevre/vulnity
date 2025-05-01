"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const apps = [
  {
    id: "password-generator",
    name: "Perfect Password",
    description: "Générateur de mots de passe ultra-sécurisés",
    icon: "🔐",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "password-strength",
    name: "Force des mots de passe",
    description: "Vérificateur de force de mot de passe",
    icon: "💪",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "encryption",
    name: "Chiffrement",
    description: "Chiffrement et déchiffrement de données",
    icon: "🔑",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "hash-generator",
    name: "Générateur de hachage",
    description: "Création de hachages cryptographiques",
    icon: "🧮",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "mail-scanner",
    name: "Analyseur d'emails",
    description: "Analyse des en-têtes d'emails",
    icon: "📧",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "beautiful-code",
    name: "Code Parfait",
    description: "Normalisation et formatage de code",
    icon: "📝",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "qr-generator",
    name: "Générateur QR",
    description: "Générateur de QR code pour WiFi",
    icon: "📱",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "file-integrity",
    name: "Intégrité des fichiers",
    description: "Vérificateur d'intégrité de fichiers",
    icon: "📂",
    color: "bg-purple-600",
    available: true,
    version: "v1.0.0",
  },
  {
    id: "ssl-checker",
    name: "Vérificateur SSL",
    description: "Vérification de la configuration SSL/TLS",
    icon: "🔒",
    color: "bg-purple-600",
    available: false,
  },
  {
    id: "domain-analyzer",
    name: "Analyseur de domaine",
    description: "Analyse d'IP et de domaines",
    icon: "🌐",
    color: "bg-purple-600",
    available: false,
  },
  {
    id: "url-scan",
    name: "Analyse d'URL",
    description: "Analyse de sécurité des URLs",
    icon: "🔍",
    color: "bg-purple-600",
    available: false,
  },
  {
    id: "cve-explorer",
    name: "Explorateur CVE",
    description: "Analyse des vulnérabilités connues",
    icon: "🛡️",
    color: "bg-purple-600",
    available: false,
  },
]

function HomePage() {
  const [hoveredApp, setHoveredApp] = useState(null)

  const renderAppCard = (app) => {
    if (app.available) {
      return (
        <Link
          to={`/${app.id}`}
          key={app.id}
          className="block"
          onMouseEnter={() => setHoveredApp(app.id)}
          onMouseLeave={() => setHoveredApp(null)}
        >
          <div className="aspect-square p-6 bg-[#1a1a2e] hover:bg-purple-900/30 transition-colors relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>

            {/* Version badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-purple-600/80 text-white text-xs font-medium px-2 py-0.5 rounded-bl-md">
                {app.version}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              <div className="text-3xl mb-3">{app.icon}</div>
              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{app.description}</p>

              {/* Hover indicator - Using CSS transitions instead of motion for Safari compatibility */}
              <div className="mt-auto pt-4 flex justify-end">
                <div
                  className={`text-purple-400 text-sm font-medium transform transition-all duration-200 ease-out ${
                    hoveredApp === app.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  Ouvrir l'application →
                </div>
              </div>
            </div>

            {/* Border glow effect on hover - Using CSS transitions for Safari compatibility */}
            <div
              className={`absolute inset-0 border border-purple-500/50 pointer-events-none transition-opacity duration-200 ${
                hoveredApp === app.id ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>
        </Link>
      )
    } else {
      return (
        <div
          key={app.id}
          className="block"
          onMouseEnter={() => setHoveredApp(app.id)}
          onMouseLeave={() => setHoveredApp(null)}
        >
          <div className="aspect-square p-6 bg-[#1a1a2e] hover:bg-purple-900/20 transition-colors relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>

            {/* Coming soon badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-md">Prochainement</div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              <div className="text-3xl mb-3 opacity-60">{app.icon}</div>
              <h3 className="font-bold text-lg text-white/70 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-400">{app.description}</p>

              {/* Hover indicator - Using CSS transitions instead of motion for Safari compatibility */}
              <div className="mt-auto pt-4 flex justify-end">
                <div
                  className={`text-purple-400/70 text-sm font-medium transform transition-all duration-200 ease-out ${
                    hoveredApp === app.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  Bientôt disponible
                </div>
              </div>
            </div>

            {/* Overlay for coming soon */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e]">
      {/* Header */}
      <header className="p-6 border-b border-purple-900/30 bg-[#0f0f1a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-purple-400">VULNITY</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Suite d'outils de cybersécurité</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Outils de Sécurité Professionnels</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une suite complète d'applications de cybersécurité conçues pour protéger vos données et renforcer votre
              sécurité en ligne.
            </p>
          </div>

          {/* Grid Layout with borders */}
          <div className="border-l border-r border-purple-900/30 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-purple-900/30">
              {apps.map((app) => renderAppCard(app))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
