"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Loader2, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isLogin ? "login" : "register", name, password }),
      });

      // Catch the exact server response before it breaks
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.user) {
          localStorage.setItem("fittrack_user", JSON.stringify(data.user));
          router.push("/dashboard"); 
        } else {
          alert(data.error || "Authentication failed");
        }
      } catch (err) {
        console.error("SERVER RETURNED THIS CRASH MESSAGE:", text);
        alert("Server crashed! Check the browser console (F12) to see the exact error.");
      }

    } catch (error) {
      console.error("NETWORK ERROR:", error);
      alert("Network error. Is your server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-10">
        <ArrowLeft size={20} /> Home
      </Link>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-10">
        <Dumbbell className="text-white mx-auto mb-6 opacity-80" size={40} />
        <h1 className="text-3xl font-light text-center mb-2 tracking-wide">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {isLogin ? "Access your personalized protocols." : "Join the lab and start building."}
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username"
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/40 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/40 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} type="button" className="text-sm text-gray-400 hover:text-white transition-colors">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}