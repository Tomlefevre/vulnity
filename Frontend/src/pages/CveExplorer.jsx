import AppLayout from "../components/AppLayout"

function CveExplorer() {
  return (
    <AppLayout
      title="Explorateur de CVE"
      description="Recherchez et analysez les vulnérabilités de sécurité connues (CVE) pour évaluer les risques potentiels de vos systèmes."
    >
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-purple-600/20 p-4 rounded-full mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Prochainement disponible</h3>
          <p className="text-gray-300 max-w-lg mb-6">
            Notre explorateur de CVE (Common Vulnerabilities and Exposures) est en cours de développement. Cet outil
            vous permettra de rechercher, analyser et suivre les vulnérabilités de sécurité connues pour mieux protéger
            vos systèmes.
          </p>
          <div className="bg-[#0f0f1a] p-4 rounded-md border border-purple-900/30 w-full max-w-lg">
            <h4 className="text-lg font-semibold mb-3 text-purple-400">Fonctionnalités à venir :</h4>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-gray-300">Recherche avancée dans la base de données CVE</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-gray-300">Évaluation des risques et scores CVSS</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-gray-300">Alertes personnalisées pour les nouvelles vulnérabilités</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-gray-300">Recommandations de correction et mesures d'atténuation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-gray-300">Intégration avec les scanners de vulnérabilités</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default CveExplorer
