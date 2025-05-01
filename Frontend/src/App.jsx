import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import PasswordGenerator from "./pages/PasswordGeneratorPage"
import BeautifulCode from "./pages/BeautifulCode"
import HeaderMailScanner from "./pages/HeaderMailScanner"
import PasswordStrength from "./pages/PasswordStrength"
import Encryption from "./pages/Encryption"
import HashGenerator from "./pages/HashGenerator"
import QrCodeGenerator from "./pages/QrCodeGenerator"
import FileIntegrity from "./pages/FileIntegrity"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import "./styles.css"

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-b from-[#001233] to-[#000814] text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/beautiful-code" element={<BeautifulCode />} />
          <Route path="/mail-scanner" element={<HeaderMailScanner />} />
          <Route path="/password-strength" element={<PasswordStrength />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/qr-generator" element={<QrCodeGenerator />} />
          <Route path="/file-integrity" element={<FileIntegrity />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* Redirection par défaut pour toutes les autres routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
