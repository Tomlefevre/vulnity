"use client"

import { useState } from "react"
import AppLayout from "../components/AppLayout"

function BeautifulCode() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [formattedCode, setFormattedCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "python", name: "Python" },
    { id: "php", name: "PHP" },
    { id: "java", name: "Java" },
    { id: "csharp", name: "C#" },
    { id: "sql", name: "SQL" },
  ]

  const formatCode = () => {
    if (!code) return

    setIsProcessing(true)

    // Simuler un traitement
    setTimeout(() => {
      // Fonction simplifiée de formatage (dans une application réelle, utilisez une bibliothèque de formatage)
      let result = code

      // Formatage basique selon le langage
      if (language === "javascript" || language === "java" || language === "csharp") {
        // Formatage simple pour les langages à accolades
        result = formatBracedLanguage(code)
      } else if (language === "html") {
        // Formatage simple pour HTML
        result = formatHTML(code)
      } else if (language === "css") {
        // Formatage simple pour CSS
        result = formatCSS(code)
      } else if (language === "python") {
        // Formatage simple pour Python
        result = formatPython(code)
      } else if (language === "sql") {
        // Formatage simple pour SQL
        result = formatSQL(code)
      }

      setFormattedCode(result)
      setIsProcessing(false)
    }, 1000)
  }

  // Fonctions de formatage simplifiées
  const formatBracedLanguage = (code) => {
    // Remplacer les accolades et ajouter des sauts de ligne
    return code
      .replace(/\{/g, " {\n")
      .replace(/\}/g, "}\n")
      .replace(/;/g, ";\n")
      .replace(/\n\s*\n/g, "\n") // Supprimer les lignes vides multiples
      .split("\n")
      .map((line) => {
        // Indentation basique
        let indent = 0
        for (let i = 0; i < line.length; i++) {
          if (line[i] === "{") indent--
          if (line[i] === "}") indent--
        }
        return "  ".repeat(Math.max(0, indent)) + line.trim()
      })
      .join("\n")
  }

  const formatHTML = (code) => {
    // Formatage très basique pour HTML
    return code
      .replace(/></g, ">\n<")
      .replace(/<\/([a-z0-9]+)>/g, "</$1>\n")
      .replace(/<([a-z0-9]+)([^>]*)>/g, "<$1$2>\n")
      .replace(/\n\s*\n/g, "\n") // Supprimer les lignes vides multiples
  }

  const formatCSS = (code) => {
    // Formatage très basique pour CSS
    return code
      .replace(/\{/g, " {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}/g, "\n}\n")
      .replace(/\n\s*\n/g, "\n") // Supprimer les lignes vides multiples
  }

  const formatPython = (code) => {
    // Formatage très basique pour Python
    return code.replace(/:/g, ":\n").replace(/\n\s*\n/g, "\n") // Supprimer les lignes vides multiples
  }

  const formatSQL = (code) => {
    // Formatage très basique pour SQL
    return code
      .replace(/SELECT/gi, "SELECT\n  ")
      .replace(/FROM/gi, "\nFROM\n  ")
      .replace(/WHERE/gi, "\nWHERE\n  ")
      .replace(/ORDER BY/gi, "\nORDER BY\n  ")
      .replace(/GROUP BY/gi, "\nGROUP BY\n  ")
      .replace(/HAVING/gi, "\nHAVING\n  ")
      .replace(/JOIN/gi, "\nJOIN\n  ")
      .replace(/AND/gi, "\n  AND ")
      .replace(/OR/gi, "\n  OR ")
      .replace(/\n\s*\n/g, "\n") // Supprimer les lignes vides multiples
  }

  const copyToClipboard = () => {
    if (!formattedCode) return

    navigator.clipboard
      .writeText(formattedCode)
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
      title="Beautiful Code"
      color="blue"
      description="Normalisez, déboguez et sécurisez votre code avec nos outils avancés. Formatez votre code pour le rendre plus lisible et maintenable."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-2">
            Langage de programmation
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-2">
            Code à formater
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-purple-900/30 rounded-md px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            placeholder={`Collez votre code ${languages.find((l) => l.id === language)?.name || ""} ici...`}
          />
        </div>

        <div className="mb-6">
          <button
            onClick={formatCode}
            disabled={!code || isProcessing}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors ${
              !code || isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Formatage en cours..." : "Formater le code"}
          </button>
        </div>

        {formattedCode && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">Code formaté</label>
              <button onClick={copyToClipboard} className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
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
                    Copier
                  </>
                )}
              </button>
            </div>
            <div className="bg-[#0f0f1a] border border-purple-900/30 rounded-md p-4 overflow-auto max-h-[400px]">
              <pre className="text-white font-mono text-sm whitespace-pre-wrap">{formattedCode}</pre>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-[#0f0f1a] rounded-md border border-purple-900/30">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Pourquoi formater votre code ?</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Améliore la lisibilité et la maintenabilité du code</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Facilite la collaboration entre développeurs</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Aide à repérer les erreurs et les bugs potentiels</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Respecte les conventions de codage standard</span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
            <p className="text-blue-300 text-sm">
              <strong>Note :</strong> Cette démonstration utilise un formatage simplifié. Pour des projets
              professionnels, nous recommandons d'utiliser des outils dédiés comme Prettier, ESLint, ou Black selon
              votre langage de programmation.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default BeautifulCode
