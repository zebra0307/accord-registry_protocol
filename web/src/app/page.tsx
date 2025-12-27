import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
              <span className="text-sm text-emerald-400">Built on Solana</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Transparent Carbon
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Credit Registry
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Register, verify, and trade carbon credits on the blockchain.
              Full lifecycle management from project registration to retirement,
              aligned with Paris Agreement Article 6.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
              >
                Explore Projects
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white font-semibold text-lg hover:bg-gray-750 transition-colors"
              >
                Register Project
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projects Registered", value: "45+" },
              { label: "Credits Issued", value: "125K" },
              { label: "Credits Retired", value: "45K" },
              { label: "Countries", value: "5" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Complete Carbon Credit Lifecycle
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From project registration to credit retirement, manage every step on-chain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "Register Projects",
                description: "Submit mangrove, forestry, and renewable energy projects with geospatial verification and ICM Registry integration.",
              },
              {
                icon: "🔍",
                title: "Verify & Audit",
                description: "Accredited validators review DePIN data including satellite imagery, IoT sensors, and ecosystem health scores.",
              },
              {
                icon: "💱",
                title: "Trade Credits",
                description: "Buy and sell credits on the P2P marketplace or provide liquidity to the built-in AMM DEX.",
              },
              {
                icon: "🏛️",
                title: "Government Approval",
                description: "Receive Letter of Authorization (LoA) for Article 6 compliance and international credit transfers.",
              },
              {
                icon: "🔥",
                title: "Retire & Offset",
                description: "Burn credits to offset emissions and receive immutable, soulbound retirement certificates.",
              },
              {
                icon: "📊",
                title: "Track Impact",
                description: "Monitor environmental impact with real-time analytics, leaderboards, and SDG contribution tracking.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the future of transparent carbon markets. Connect your wallet to get started.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
          >
            Launch App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold text-white">Accord Registry</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built for a sustainable future 🌍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
