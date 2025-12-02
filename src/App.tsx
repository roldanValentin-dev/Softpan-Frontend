function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Softpan
        </h1>
        <p className="text-gray-600 mb-6">
          Sistema de gestión para panadería
        </p>
        <div className="space-y-3">
          <button className="btn-primary w-full">
            Iniciar Sesión
          </button>
          <button className="btn-secondary w-full">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}

export default App