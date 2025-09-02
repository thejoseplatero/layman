"use client";

export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">🧪 Tailwind CSS Test - Warm Theme</h1>
        
        {/* Basic Utilities Test */}
        <div className="space-y-4">
          <h2 className="text-xl text-text-primary">Basic Utilities</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500 p-4 rounded text-white">Red Background</div>
            <div className="bg-green-500 p-4 rounded text-white">Green Background</div>
            <div className="bg-blue-500 p-4 rounded text-white">Blue Background</div>
          </div>
        </div>

        {/* Custom Colors Test */}
        <div className="space-y-4">
          <h2 className="text-xl text-text-primary">Warm Theme Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary-main p-4 rounded text-dark">Primary (Golden)</div>
            <div className="bg-secondary-main p-4 rounded text-background-card">Secondary (Warm Brown)</div>
            <div className="bg-dark p-4 rounded text-background">Dark Accent</div>
          </div>
        </div>

        {/* Glassmorphism Test */}
        <div className="space-y-4 relative">
          <h2 className="text-xl text-text-primary">Warm Glassmorphism</h2>
          <div className="bg-gradient-to-r from-primary-main to-secondary-main p-8 rounded-xl">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <p className="text-dark">
                🎉 Warm glassmorphism with golden gradient background
              </p>
            </div>
          </div>
        </div>

        {/* Custom Component Classes Test */}
        <div className="space-y-4">
          <h2 className="text-xl text-text-primary">Custom Component Classes</h2>
          <div className="glass-panel p-6">
            <p className="text-text-primary">Warm Glass Panel Component</p>
          </div>
          
          <div className="space-x-4">
            <button className="btn-primary">Golden Primary</button>
            <button className="btn-secondary">Warm Secondary</button>
          </div>
          
          <input className="input-glass w-full" placeholder="Warm Glass Input Field" />
        </div>

        {/* Theme Toggle Test */}
        <div className="space-y-4">
          <h2 className="text-xl text-text-primary">Theme Toggle</h2>
          <div className="bg-background-card dark:bg-dark-lighter p-4 rounded border border-glass-border">
            <p className="text-text-primary dark:text-background">
              This adapts between warm light and dark themes. Use the theme toggle to switch!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}