"use client"

import { useState, useRef } from "react"
import AppLayout from "../components/AppLayout"

function FileIntegrity() {
  const [file, setFile] = useState(null)
  const [hashType, setHashType] = useState("sha-256")
  const [hashValue, setHashValue] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const hashTypes = [
    { id: "sha-1", name: "SHA-1" },
    { id: "sha-256", name: "SHA-256" },
    { id: "sha-384", name: "SHA-384" },
    { id: "sha-512", name: "SHA-512" },
  ]

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setHashValue("")
      setResult(null)
      setError("")
    }
  }

  const calculateHash = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier")
      return
    }

    setIsCalculating(true)
    setError("")
    setResult(null)

    try {
      const hash = await computeFileHash(file, hashType)
      setHashValue(hash)

      // Si un hash de comparaison est fourni, vérifier la correspondance
      if (compareHash) {
        const match = compareHash.trim().toLowerCase() === hash.toLowerCase()
        setResult({
          match,
          message: match
            ? "Les hachages correspondent ! L'intégrité du fichier est vérifiée."
            : "Les hachages ne correspondent pas. Le fichier pourrait être corrompu ou modifié.",
        })
      }
    } catch (err) {
      setError(`Erreur lors du calcul du hachage: ${err.message}`)
    } finally {
      setIsCalculating(false)
    }
  }

  const computeFileHash = async (file, algorithm) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const buffer = event.target.result

          // Utiliser l'API Web Crypto pour calculer le hash
          const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), buffer)

          // Convertir le buffer en chaîne hexadécimale
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
          resolve(hashHex)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const copyToClipboard = () => {
    if (!hashValue) return

    navigator.clipboard
      .writeText(hashValue)
      .then(() => {
        setResult({
          ...result,
          copied: true,
        })
        setTimeout(() => {
          setResult({
            ...result,
            copied: false,
          })
        }, 2000)
      })
      .catch((err) => {
        console.error("Erreur lors de la copie:", err)
      })
  }

  const resetForm = () => {
    setFile(null)
    setHashValue("")
    setCompareHash("")
    setResult(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <AppLayout
      title="Vérification d'Intégrité de Fichiers"
      description="Vérifiez l'intégrité de vos fichiers en calculant et comparant les hachages cryptographiques. Assurez-vous que vos fichiers n'ont pas été modifiés ou corrompus."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-400 mb-2">
            Sélectionner un fichier
          </label>
          <div className="flex items-center">
            <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Parcourir...
            </button>
            <span className="ml-3 text-gray-300 truncate">{file ? file.name : "Aucun fichier sélectionné"}</span>
          </div>
          {file && <p className="mt-1 text-sm text-gray-400">Taille: {(file.size / 1024).toFixed(2)} KB</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Algorithme de hachage</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hashTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setHashType(type.id)}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  hashType === type.id
                    ? "bg-purple-600 text-white"
                    : "bg-[#0f0f1a] text-gray-300 hover:bg-[#0f0f1a]/80 border border-purple-900/30"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="compareHash" className="block text-sm font-medium text-gray-400 mb-2">
            Hash de référence (optionnel)
          </label>
          <input
            type="text"
            id="compareHash"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Collez le hash de référence pour vérifier l'intégrité"
          />
        </div>

        <div className="mb-6">
          <button
            onClick={calculateHash}
            disabled={!file || isCalculating}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors ${
              !file || isCalculating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCalculating ? "Calcul en cours..." : "Calculer le hash"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">{error}</div>
        )}

        {hashValue && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">{hashType.toUpperCase()} Hash</label>
            <div className="relative">
              <div className="bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white font-mono break-all">
                {hashValue}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-[#0f0f1a] hover:bg-[#0f0f1a]/80 text-white p-2 rounded-md border border-purple-900/30"
                title="Copier dans le presse-papiers"
              >
                {result?.copied ? (
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

        {result && result.message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              result.match
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center">
              {result.match ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {result.message}
            </div>
          </div>
        )}

        {(hashValue || error || result) && (
          <div className="mb-6">
            <button
              onClick={resetForm}
              className="w-full bg-[#0f0f1a] hover:bg-[#0f0f1a]/80 text-white py-3 rounded-md transition-colors border border-purple-900/30"
            >
              Réinitialiser
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">À propos de la vérification d'intégrité</h3>
          <p className="text-gray-300 text-sm mb-4">
            La vérification d'intégrité des fichiers utilise des fonctions de hachage cryptographique pour s'assurer
            qu'un fichier n'a pas été modifié ou corrompu. Voici comment cela fonctionne :
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Un algorithme de hachage génère une empreinte numérique unique du fichier</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Même un changement minime dans le fichier produira un hash complètement différent</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                En comparant le hash calculé avec un hash de référence, vous pouvez vérifier si le fichier est intact
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Cette méthode est utilisée pour vérifier les téléchargements, détecter les modifications non autorisées,
                et plus encore
              </span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-md">
            <p className="text-purple-300 text-sm">
              <strong>Note :</strong> Cette application calcule les hachages localement dans votre navigateur. Aucun
              fichier n'est téléchargé sur nos serveurs, garantissant ainsi la confidentialité de vos données.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default FileIntegrity
