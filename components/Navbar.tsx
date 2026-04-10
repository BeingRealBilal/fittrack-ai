import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 fixed w-full z-50 top-0">
      {/* Glass Background effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>
      
      <Link href="/" className="relative z-10 text-xl font-light tracking-widest text-white">
        FITTRACK
      </Link>
      
      <div className="relative z-10 flex gap-4 items-center">
        <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
          Dashboard
        </Link>
        <Link href="/login" className="px-5 py-2 text-sm bg-white text-black font-medium rounded-full hover:bg-gray-200 transition">
          Sign In
        </Link>
      </div>
    </nav>
  );
}