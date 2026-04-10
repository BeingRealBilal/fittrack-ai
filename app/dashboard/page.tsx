"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Zap, LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("fittrack_user");
    if (!storedUser) router.push("/login");
    else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.workouts && parsedUser.workouts.length > 0) {
        setPlan(parsedUser.workouts[0].plan);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("fittrack_user");
    router.push("/login");
  };

  const generateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    
    setLoading(true);
    setPlan(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending 'name' instead of 'email'
        body: JSON.stringify({ goal, name: user.name }), 
      });

      const data = await res.json();
      if (data.workout) {
        setPlan(data.workout.plan);
        const updatedUser = { ...user, workouts: [data.workout] };
        localStorage.setItem("fittrack_user", JSON.stringify(updatedUser));
      } else {
        setErrorMsg(data.error || "Failed to generate.");
      }
    } catch (error) {
      setErrorMsg("Network error trying to reach AI.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-12 px-6 relative">
      <nav className="flex justify-between items-center p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 fixed w-full z-50 top-0 left-0">
        <Link href="/" className="text-xl font-light tracking-widest text-white">FITTRACK</Link>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl font-light mb-2">Welcome, <span className="font-medium text-white">{user.name}</span></h1>
        <p className="text-gray-400 mb-8">Design your protocol.</p>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-8 relative overflow-hidden shadow-2xl">
          <form onSubmit={generateWorkout} className="flex flex-col md:flex-row gap-4 relative z-10">
            <select 
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 appearance-none"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            >
              <option value="" disabled>Select Target Muscle Group...</option>
              <option value="Chest & Triceps (Push)">Chest & Triceps (Push)</option>
              <option value="Back & Biceps (Pull)">Back & Biceps (Pull)</option>
              <option value="Legs & Shoulders">Legs & Shoulders</option>
              <option value="Full Body Hypertrophy">Full Body Hypertrophy</option>
            </select>

            <button 
              type="submit" 
              disabled={loading || !goal}
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center min-w-[160px] transition-all"
            >
              {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> Compiling...</> : "Generate"}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8">
            <strong>AI Failure:</strong> {errorMsg}
          </div>
        )}

        {plan && !loading && !errorMsg && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-light text-white mb-6 border-b border-white/10 pb-4">Active Protocol</h3>
            <div className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
              {plan}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}