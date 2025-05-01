import AppLayout from "../components/AppLayout"

function About() {
  return (
    <AppLayout title="À propos de Vulnity" color="purple">
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <h3 className="text-xl font-semibold mb-4">Notre mission</h3>
        <p className="text-gray-300 mb-4">
          Vulnity a été créé avec une mission claire : rendre les outils de cybersécurité accessibles à tous. Dans un
          monde où les menaces numériques évoluent constamment, nous croyons que chacun devrait avoir accès à des outils
          de sécurité efficaces et faciles à utiliser.
        </p>

        <h3 className="text-xl font-semibold mb-4 mt-8">Nos outils</h3>
        <p className="text-gray-300 mb-4">
          Notre suite d'applications couvre un large éventail de besoins en matière de sécurité, du générateur de mots
          de passe à l'analyse de domaines, en passant par la vérification SSL et le chiffrement de données. Tous nos
          outils sont conçus pour être à la fois puissants et simples d'utilisation.
        </p>

        <h3 className="text-xl font-semibold mb-4 mt-8">Notre équipe</h3>
        <p className="text-gray-300">
          Vulnity est développé par une équipe de passionnés de cybersécurité, déterminés à créer des solutions qui
          aident les utilisateurs à protéger leurs données et leur vie privée en ligne.
        </p>
      </div>
    </AppLayout>
  )
}

export default About
