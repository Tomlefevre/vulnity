"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"

function Encryption() {
  const [mode, setMode] = useState("encrypt")
  const [algorithm, setAlgorithm] = useState("aes")
  const [input, setInput] = useState("")
  const [key, setKey] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const algorithms = [
    { id: "aes", name: "AES-256" },
    { id: "aes-gcm", name: "AES-GCM" },
  ]

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setOutput("")
    setError("")
  }

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm)
    setOutput("")
    setError("")
  }

  const processData = async () => {
    if (!input || !key) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setIsProcessing(true)
    setError("")
    setOutput("")

    try {
      if (mode === "encrypt") {
        const encryptedText = await encryptData(input, key, algorithm)
        setOutput(encryptedText)
      } else {
        try {
          const decryptedText = await decryptData(input, key, algorithm)
          setOutput(decryptedText)
        } catch (e) {
          setError("Impossible de déchiffrer le texte. Vérifiez la clé et le texte chiffré.")
        }
      }
    } catch (err) {
      setError(`Erreur: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Fonction pour dériver une clé à partir d'un mot de passe
  const deriveKey = async (password, algorithm) => {
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)

    // Utiliser SHA-256 pour créer un hachage du mot de passe
    const passwordHash = await crypto.subtle.digest("SHA-256", passwordData)

    // Créer une clé à partir du hachage
    const keyUsages = ["encrypt", "decrypt"]
    let keyParams

    if (algorithm === "aes") {
      keyParams = {
        name: "AES-CBC",
        length: 256,
      }
    } else if (algorithm === "aes-gcm") {
      keyParams = {
        name: "AES-GCM",
        length: 256,
      }
    }

    return crypto.subtle.importKey("raw", passwordHash, keyParams, false, keyUsages)
  }

  // Fonction pour chiffrer des données
  const encryptData = async (data, password, algorithm) => {
    try {
      const encoder = new TextEncoder()
      const dataToEncrypt = encoder.encode(data)

      let encryptedData, iv

      if (algorithm === "aes") {
        // Générer un vecteur d'initialisation aléatoire
        iv = crypto.getRandomValues(new Uint8Array(16))

        // Dériver une clé à partir du mot de passe
        const key = await deriveKey(password, "aes")

        // Chiffrer les données
        const encryptedBuffer = await crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            iv,
          },
          key,
          dataToEncrypt,
        )

        encryptedData = encryptedBuffer
      } else if (algorithm === "aes-gcm") {
        // Générer un vecteur d'initialisation aléatoire
        iv = crypto.getRandomValues(new Uint8Array(12))

        // Dériver une clé à partir du mot de passe
        const key = await deriveKey(password, "aes-gcm")

        // Chiffrer les données
        const encryptedBuffer = await crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv,
            tagLength: 128,
          },
          key,
          dataToEncrypt,
        )

        encryptedData = encryptedBuffer
      }

      // Combiner IV et données chiffrées
      const combinedData = new Uint8Array(iv.length + new Uint8Array(encryptedData).length)
      combinedData.set(iv)
      combinedData.set(new Uint8Array(encryptedData), iv.length)

      // Convertir en base64 pour un stockage facile
      return btoa(String.fromCharCode.apply(null, combinedData))
    } catch (error) {
      console.error("Erreur de chiffrement:", error)
      throw new Error("Échec du chiffrement")
    }
  }

  // Fonction pour déchiffrer des données
  const decryptData = async (encryptedBase64, password, algorithm) => {
    try {
      // Convertir de base64 à tableau d'octets
      const encryptedData = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0))

      let iv, ciphertext

      if (algorithm === "aes") {
        // Extraire IV (16 octets pour AES-CBC)
        iv = encryptedData.slice(0, 16)
        ciphertext = encryptedData.slice(16)

        // Dériver une clé à partir du mot de passe
        const key = await deriveKey(password, "aes")

        // Déchiffrer les données
        const decryptedBuffer = await crypto.subtle.decrypt(
          {
            name: "AES-CBC",
            iv,
          },
          key,
          ciphertext,
        )

        // Convertir le résultat en texte
        const decoder = new TextDecoder()
        return decoder.decode(decryptedBuffer)
      } else if (algorithm === "aes-gcm") {
        // Extraire IV (12 octets pour AES-GCM)
        iv = encryptedData.slice(0, 12)
        ciphertext = encryptedData.slice(12)

        // Dériver une clé à partir du mot de passe
        const key = await deriveKey(password, "aes-gcm")

        // Déchiffrer les données
        const decryptedBuffer = await crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv,
            tagLength: 128,
          },
          key,
          ciphertext,
        )

        // Convertir le résultat en texte
        const decoder = new TextDecoder()
        return decoder.decode(decryptedBuffer)
      }
    } catch (error) {
      console.error("Erreur de déchiffrement:", error)
      throw new Error("Échec du déchiffrement")
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

  // Fonction pour échapper les entrées utilisateur contre les attaques XSS
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  return (
    <AppLayout
      title="Chiffrement et Déchiffrement"
      description="Chiffrez et déchiffrez vos données avec différents algorithmes. Tous les calculs sont effectués localement dans votre navigateur."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex border border-purple-900/30 rounded-md overflow-hidden">
            <button
              onClick={() => handleModeChange("encrypt")}
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                mode === "encrypt" ? "bg-purple-600 text-white" : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80"
              }`}
            >
              Chiffrer
            </button>
            <button
              onClick={() => handleModeChange("decrypt")}
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                mode === "decrypt" ? "bg-purple-600 text-white" : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80"
              }`}
            >
              Déchiffrer
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Algorithme de chiffrement</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleAlgorithmChange(algo.id)}
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
          <label htmlFor="input" className="block text-sm font-medium text-gray-400 mb-2">
            {mode === "encrypt" ? "Texte à chiffrer" : "Texte à déchiffrer"}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(escapeHtml(e.target.value))}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder={mode === "encrypt" ? "Entrez le texte à chiffrer" : "Entrez le texte chiffré à déchiffrer"}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="key" className="block text-sm font-medium text-gray-400 mb-2">
            Clé de {mode === "encrypt" ? "chiffrement" : "déchiffrement"}
          </label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(escapeHtml(e.target.value))}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Entrez votre clé secrète"
          />
        </div>

        <div className="mb-6">
          <button
            onClick={processData}
            disabled={!input || !key || isProcessing}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors ${
              !input || !key || isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Traitement en cours..." : mode === "encrypt" ? "Chiffrer le texte" : "Déchiffrer le texte"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">{error}</div>
        )}

        {output && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {mode === "encrypt" ? "Texte chiffré" : "Texte déchiffré"}
            </label>
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
          <h3 className="text-lg font-semibold mb-3 text-purple-400">À propos des algorithmes de chiffrement</h3>
          <ul className="space-y-3">
            <li>
              <span className="font-medium text-purple-300">AES-256</span>
              <p className="text-gray-300 text-sm mt-1">
                Advanced Encryption Standard avec une clé de 256 bits. C'est l'un des algorithmes de chiffrement les
                plus sécurisés et les plus utilisés au monde, adopté par le gouvernement américain.
              </p>
            </li>
            <li>
              <span className="font-medium text-purple-300">AES-GCM</span>
              <p className="text-gray-300 text-sm mt-1">
                Mode d'opération Galois/Counter pour AES qui fournit à la fois le chiffrement et l'authentification. Il
                est particulièrement efficace et sécurisé pour les communications chiffrées.
              </p>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-md">
            <p className="text-purple-300 text-sm">
              <strong>Note de sécurité :</strong> Toutes les opérations de chiffrement sont effectuées localement dans
              votre navigateur grâce à l'API Web Crypto. Vos données ne quittent jamais votre appareil.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Encryption
