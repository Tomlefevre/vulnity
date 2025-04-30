import AppLayout from "../components/AppLayout"
import PasswordGenerator from "../containers/PasswordGenerator"

function PasswordGeneratorPage() {
  return (
    <AppLayout
      title="Perfect Password"
      color="purple"
      description="Générez un mot de passe ultra-sécurisé avec notre technologie avancée. Chaque mot de passe est unique, fort et résistant aux attaques."
    >
      <PasswordGenerator />
    </AppLayout>
  )
}

export default PasswordGeneratorPage
