"use client"

import { Link } from "react-router-dom"
import Footer from "./Footer"

function AppLayout({ title, description, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e]">
      {/* Header */}
      <header className="p-6 border-b border-purple-900/30 bg-[#0f0f1a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-3xl font-bold text-white">
                <span className="text-purple-400">VULNITY</span>
              </Link>
              <p className="text-sm text-gray-400 mt-1">Suite d'outils de cybersécurité</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">{title}</h2>
          {description && <p className="text-gray-300 mb-8 max-w-3xl">{description}</p>}
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AppLayout
