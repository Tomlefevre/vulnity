import PasswordGenerator from "../containers/PasswordGenerator"

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#001233] to-[#000814] text-white p-4">
      <div className="absolute top-4 md:top-8 left-4 md:left-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider">VULNITY</h1>
      </div>

      <div className="w-full max-w-sm md:max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-purple-400">Perfect Password</h2>
        <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-12 max-w-xl mx-auto">
          Générez un mot de passe ultra-sécurisé avec notre technologie avancée. Chaque mot de passe est unique, fort et
          résistant aux attaques.
        </p>

        <PasswordGenerator />
      </div>
    </main>
  )
}

export default Home
