import AppLayout from "../components/AppLayout"

function Terms() {
  return (
    <AppLayout title="Conditions d'utilisation" color="purple">
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Acceptation des conditions</h3>
          <p className="text-gray-300">
            En accédant et en utilisant le site web de Vulnity, vous acceptez d'être lié par ces conditions
            d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Utilisation du site</h3>
          <p className="text-gray-300">
            Vous acceptez d'utiliser notre site uniquement à des fins légales et d'une manière qui ne porte pas atteinte
            aux droits d'autrui ou ne restreint pas leur utilisation du site. Vous ne devez pas utiliser notre site
            d'une manière qui pourrait endommager, désactiver, surcharger ou compromettre nos systèmes.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Propriété intellectuelle</h3>
          <p className="text-gray-300">
            Tout le contenu présent sur ce site, y compris les textes, graphiques, logos, icônes, images, clips audio,
            téléchargements numériques et compilations de données, est la propriété de Vulnity ou de ses fournisseurs de
            contenu et est protégé par les lois internationales sur le droit d'auteur.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Limitation de responsabilité</h3>
          <p className="text-gray-300">
            Vulnity ne sera pas responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs
            résultant de votre accès ou de votre utilisation de notre site. Nous ne garantissons pas que notre site sera
            disponible sans interruption ou sans erreur.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Liens vers d'autres sites</h3>
          <p className="text-gray-300">
            Notre site peut contenir des liens vers des sites web tiers. Ces liens sont fournis uniquement pour votre
            commodité. Nous n'avons aucun contrôle sur le contenu de ces sites et ne sommes pas responsables de leur
            contenu ou de leurs pratiques en matière de confidentialité.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Modifications des conditions</h3>
          <p className="text-gray-300">
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications
            entreront en vigueur dès leur publication sur notre site. Votre utilisation continue du site après la
            publication des modifications constitue votre acceptation de ces modifications.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Loi applicable</h3>
          <p className="text-gray-300">
            Ces conditions d'utilisation sont régies par les lois de la France. Tout litige relatif à ces conditions
            sera soumis à la compétence exclusive des tribunaux français.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-gray-300">
            Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse
            suivante : legal@vulnity.fr
          </p>
          <p className="text-gray-400 mt-2">Dernière mise à jour : 1 mai 2023</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default Terms
