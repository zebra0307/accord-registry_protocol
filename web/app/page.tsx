import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-24 flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-sm mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-2 animate-pulse"></span>
          Protocol Live on Testnet
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 font-outfit">
          The Future of <br />
          <span className="text-teal-400">Accord Protocol</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
          A decentralized registry for verified real-world environmental assets.
          Secured by H3 geospatial locking and government-backed identity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-teal-500/20">
            Launch Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/docs" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-sm">
            Protocol Specs
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full text-left">
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-blue-400" />}
            title="H3 Geospatial Lock"
            desc="Prevents double counting by applying hexagonal hashing to physical locations, ensuring no two projects claim the same land."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-purple-400" />}
            title="Gov-Backed Identity"
            desc="Integrates government compliance IDs (e.g., ICM) with cryptographically verified signatures for fraud-proof project registration."
          />
          <FeatureCard
            icon={<Leaf className="w-6 h-6 text-teal-400" />}
            title="Universal Registry"
            desc="A unified standard supporting Blue Carbon, Forestry, Renewable Energy, and Industrial sectors with transparent verification escrow."
          />
        </div>

        {/* Stats Placeholder */}
        <div className="mt-24 w-full border-t border-white/5 pt-12">
          <div className="flex justify-around items-center flex-wrap gap-8 opacity-70">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0+</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0 tCO2e</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Verified Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Validators</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-teal-500/30 transition-all hover:bg-slate-900/80 backdrop-blur-md group">
      <div className="mb-6 p-4 rounded-2xl bg-black/40 w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 font-outfit text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}
