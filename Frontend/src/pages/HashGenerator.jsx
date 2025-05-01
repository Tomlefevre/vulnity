"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { escapeHtml } from "../utils/security"

function HashGenerator() {
  const [input, setInput] = useState("")
  const [algorithm, setAlgorithm] = useState("sha-256")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const algorithms = [
    { id: "sha-1", name: "SHA-1" },
    { id: "sha-256", name: "SHA-256" },
    { id: "sha-384", name: "SHA-384" },
    { id: "sha-512", name: "SHA-512" },
  ]

  // Fonction pour générer le hash
  const generateHash = async () => {
    if (!input) return

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      // Utiliser l'API Web Crypto pour générer le hash
      const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data)

      // Convertir le buffer en chaîne hexadécimale
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      setOutput(hashHex)
    } catch (error) {
      console.error("Erreur lors de la génération du hash:", error)
      setOutput("Erreur lors de la génération du hash")
    }
  }

  const copyToClipboard = () => {
    if (!output) return

    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Erreur lors de la copie:", err)
      })
  }

  return (
    <AppLayout
      title="Générateur de Hash"
      description="Générez des hachages cryptographiques avec différents algorithmes. Tous les calculs sont effectués localement dans votre navigateur."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-400 mb-2">
            Texte à hacher
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(escapeHtml(e.target.value))}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder="Entrez le texte que vous souhaitez hacher"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Algorithme de hachage</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setAlgorithm(algo.id)}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  algorithm === algo.id
                    ? "bg-purple-600 text-white"
                    : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80 border border-purple-900/30"
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={generateHash}
            disabled={!input}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors ${
              !input ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Générer le hash
          </button>
        </div>

        {output && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Résultat ({algorithm.toUpperCase()})</label>
            <div className="relative">
              <div className="bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white font-mono break-all">
                {output}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-[#0f0f1a] hover:bg-[#0f0f1a]/80 text-white p-2 rounded-md border border-purple-900/30"
                title="Copier dans le presse-papiers"
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-400"
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
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">À propos des algorithmes de hachage</h3>
          <ul className="space-y-3">
            <li>
              <span className="font-medium text-purple-300">SHA-1</span>
              <p className="text-gray-300 text-sm mt-1">
                Produit un hash de 160 bits (20 octets). Considéré comme obsolète pour les applications de sécurité en
                raison de vulnérabilités connues.
              </p>
            </li>
            <li>
              <span className="font-medium text-purple-300">SHA-256</span>
              <p className="text-gray-300 text-sm mt-1">
                Fait partie de la famille SHA-2, produit un hash de 256 bits (32 octets). Largement utilisé et considéré
                comme sécurisé.
              </p>
            </li>
            <li>
              <span className="font-medium text-purple-300">SHA-384</span>
              <p className="text-gray-300 text-sm mt-1">
                Fait partie de la famille SHA-2, produit un hash de 384 bits (48 octets). Offre un niveau de sécurité
                intermédiaire entre SHA-256 et SHA-512.
              </p>
            </li>
            <li>
              <span className="font-medium text-purple-300">SHA-512</span>
              <p className="text-gray-300 text-sm mt-1">
                Fait partie de la famille SHA-2, produit un hash de 512 bits (64 octets). Offre une sécurité renforcée
                par rapport à SHA-256.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}

export default HashGenerator
