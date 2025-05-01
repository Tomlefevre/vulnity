"use client"

import { useState, useRef } from "react"
import AppLayout from "../components/AppLayout"

function QrCodeGenerator() {
  const [formData, setFormData] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  })
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const generateQRCode = async () => {
    if (!formData.ssid) return

    setIsGenerating(true)

    try {
      // Créer le contenu WiFi selon le format standard
      let wifiString = `WIFI:S:${encodeURIComponent(formData.ssid)};`

      if (formData.password) {
        wifiString += `P:${encodeURIComponent(formData.password)};`
      }

      wifiString += `T:${formData.encryption};`

      if (formData.hidden) {
        wifiString += "H:true;"
      }

      wifiString += ";"

      // Utiliser l'API QR Code Generator
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(wifiString)}&size=200x200&margin=10`
      setQrCodeUrl(qrCodeApiUrl)
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `wifi-qr-${formData.ssid}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AppLayout
      title="Générateur de QR Code WiFi"
      color="cyan"
      description="Créez facilement un QR code pour partager vos informations de connexion WiFi. Scannez simplement le code avec un smartphone pour vous connecter sans saisir de mot de passe."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Informations WiFi</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="ssid" className="block text-sm font-medium text-gray-400 mb-1">
                Nom du réseau (SSID) *
              </label>
              <input
                type="text"
                id="ssid"
                name="ssid"
                value={formData.ssid}
                onChange={handleChange}
                className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Entrez le nom de votre réseau WiFi"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Mot de passe
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Entrez le mot de passe WiFi"
              />
            </div>

            <div>
              <label htmlFor="encryption" className="block text-sm font-medium text-gray-400 mb-1">
                Type de sécurité
              </label>
              <select
                id="encryption"
                name="encryption"
                value={formData.encryption}
                onChange={handleChange}
                className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Aucun (réseau ouvert)</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hidden"
                name="hidden"
                checked={formData.hidden}
                onChange={handleChange}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-700 rounded bg-[#0f0f1a]"
              />
              <label htmlFor="hidden" className="ml-2 block text-sm text-gray-400">
                Réseau caché
              </label>
            </div>

            <button
              onClick={generateQRCode}
              disabled={!formData.ssid || isGenerating}
              className={`w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md transition-colors ${
                !formData.ssid || isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? "Génération en cours..." : "Générer le QR Code"}
            </button>
          </div>
        </div>

        <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <>
              <div className="bg-white p-4 rounded-lg mb-4">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code WiFi" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-center text-gray-300 mb-4">
                Scannez ce QR code avec l'appareil photo de votre smartphone pour vous connecter automatiquement au
                réseau WiFi.
              </p>
              <button
                onClick={downloadQRCode}
                className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Télécharger le QR Code
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto mb-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <p>Remplissez le formulaire et cliquez sur "Générer le QR Code" pour créer votre QR code WiFi.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Comment ça marche ?</h3>
        <ol className="list-decimal pl-5 space-y-3 text-gray-300">
          <li>
            <span className="font-medium text-white">Entrez les informations de votre réseau WiFi</span>
            <p className="mt-1">
              Remplissez le formulaire avec le nom de votre réseau (SSID), le mot de passe et le type de sécurité.
            </p>
          </li>
          <li>
            <span className="font-medium text-white">Générez le QR code</span>
            <p className="mt-1">Cliquez sur le bouton "Générer le QR Code" pour créer votre QR code WiFi.</p>
          </li>
          <li>
            <span className="font-medium text-white">Partagez ou téléchargez</span>
            <p className="mt-1">
              Téléchargez le QR code généré ou montrez-le directement à vos invités pour qu'ils puissent le scanner.
            </p>
          </li>
          <li>
            <span className="font-medium text-white">Connexion instantanée</span>
            <p className="mt-1">
              Les utilisateurs peuvent scanner le QR code avec l'appareil photo de leur smartphone pour se connecter
              automatiquement au réseau WiFi sans avoir à saisir le mot de passe.
            </p>
          </li>
        </ol>
      </div>
    </AppLayout>
  )
}

export default QrCodeGenerator
