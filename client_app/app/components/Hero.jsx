import { Link } from "@remix-run/react";

export default function Hero({ isAuthenticated }) {
  const targetRoute = isAuthenticated ? "/space" : "/space"

  return (
    <section className="relative overflow-hidden text-center py-32 px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Glowing Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-700 rounded-full opacity-20 blur-3xl z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-4 animate-fade-in delay-100">
          Your Social Proof Engine
        </h2>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent animate-fade-in delay-200">
          Collect Powerful Testimonials
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in delay-300">
          Effortlessly gather text and video testimonials from your customers
          to build trust, showcase your product, and grow faster.
        </p>

        <Link to={targetRoute}>
          <button className="bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-100 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 animate-fade-in ">
            Get Started for Free
          </button>
        </Link>
      </div>
    </section>
  );
}
