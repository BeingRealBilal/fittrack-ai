import Link from "next/link";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center mt-20">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-sm text-gray-300 font-light tracking-wide">Next-Gen AI Protocols</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight max-w-4xl">
          Engineer Your <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Perfect Protocol</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
          Stop guessing. Step into the lab and let our AI compile hyper-optimized strength and hypertrophy programs tailored exactly to your goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Enter The Lab <ArrowRight size={20} />
          </Link>
        </div>

        {/* Glass Features Panel */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <FeatureCard 
            icon={<Activity />} 
            title="Adaptive AI" 
            desc="Protocols that adapt to your specific target muscle groups instantly." 
          />
          <FeatureCard 
            icon={<Zap />} 
            title="Zero Wait Time" 
            desc="Generate fully structured workout regimens in milliseconds." 
          />
          <FeatureCard 
            icon={<Shield />} 
            title="Secure Data" 
            desc="Your progress and routines are encrypted and safely stored in the cloud." 
          />
        </div>
      </div>
    </main>
  );
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-left hover:bg-white/10 transition-colors">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm font-light leading-relaxed">{desc}</p>
    </div>
    
  );
}