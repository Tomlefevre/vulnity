import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import PasswordGenerator from "./pages/PasswordGeneratorPage"
import BeautifulCode from "./pages/BeautifulCode"
import HeaderMailScanner from "./pages/HeaderMailScanner"
import UrlScan from "./pages/UrlScan"
import PasswordStrength from "./pages/PasswordStrength"
import SslChecker from "./pages/SslChecker"
import DomainAnalyzer from "./pages/DomainAnalyzer"
import Encryption from "./pages/Encryption"
import HashGenerator from "./pages/HashGenerator"
import QrCodeGenerator from "./pages/QrCodeGenerator"
import FileIntegrity from "./pages/FileIntegrity"
import CveExplorer from "./pages/CveExplorer"
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
          <Route path="/url-scan" element={<UrlScan />} />
          <Route path="/password-strength" element={<PasswordStrength />} />
          <Route path="/ssl-checker" element={<SslChecker />} />
          <Route path="/domain-analyzer" element={<DomainAnalyzer />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/qr-generator" element={<QrCodeGenerator />} />
          <Route path="/file-integrity" element={<FileIntegrity />} />
          <Route path="/cve-explorer" element={<CveExplorer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
