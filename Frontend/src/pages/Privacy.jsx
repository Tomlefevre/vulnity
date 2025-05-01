import AppLayout from "../components/AppLayout"

function Privacy() {
  return (
    <AppLayout title="Politique de confidentialité" color="purple">
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Introduction</h3>
          <p className="text-gray-300">
            Chez Vulnity, nous accordons une grande importance à la protection de vos données personnelles. Cette
            politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations
            lorsque vous utilisez notre site web et nos services.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Collecte d'informations</h3>
          <p className="text-gray-300">
            Nous collectons uniquement les informations nécessaires pour vous fournir nos services. Cela peut inclure
            votre adresse e-mail, votre nom et d'autres informations que vous nous fournissons volontairement.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Utilisation des données</h3>
          <p className="text-gray-300">Les données que nous collectons sont utilisées pour :</p>
          <ul className="list-disc pl-6 mt-2 text-gray-300 space-y-1">
            <li>Fournir et améliorer nos services</li>
            <li>Communiquer avec vous concernant votre compte ou nos services</li>
            <li>Personnaliser votre expérience utilisateur</li>
            <li>Analyser l'utilisation de notre site pour l'améliorer</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Protection des données</h3>
          <p className="text-gray-300">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès non
            autorisé, altération, divulgation ou destruction. Vos données sont stockées sur des serveurs sécurisés et ne
            sont accessibles qu'à un nombre limité de personnes.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Cookies et technologies similaires</h3>
          <p className="text-gray-300">
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site,
            analyser comment nos services sont utilisés et personnaliser le contenu. Vous pouvez contrôler l'utilisation
            des cookies via les paramètres de votre navigateur.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Vos droits</h3>
          <p className="text-gray-300">
            Vous avez le droit d'accéder à vos données personnelles, de les rectifier, de les supprimer ou d'en limiter
            le traitement. Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée ci-dessous.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-gray-300">
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à
            l'adresse suivante : privacy@vulnity.fr
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Modifications</h3>
          <p className="text-gray-300">
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute
            modification sera publiée sur cette page avec une date de mise à jour.
          </p>
          <p className="text-gray-400 mt-2">Dernière mise à jour : 1 mai 2025</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default Privacy
