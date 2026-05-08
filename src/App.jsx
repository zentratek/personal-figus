function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bungee mb-4" style={{ color: 'var(--lime)' }}>
          FIGUS
        </h1>
        <p className="text-xl text-[var(--muted)] mb-8">
          Phase 0: Setup Complete ✅
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-6 py-3 bg-[var(--primary)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]">
            Dark Mode Cyberpunk
          </div>
          <div className="px-6 py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]">
            Ready to Code
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
