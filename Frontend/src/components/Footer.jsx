import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-[#0f0f1a] border-t border-purple-900/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">© 2023 Vulnity. Tous droits réservés.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
