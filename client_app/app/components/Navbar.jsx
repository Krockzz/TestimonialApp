import { Link, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useNavigation()
  const isLoggingOut = navigation.state === "submitting"

  const navLinks = (
    <>
      {[
        { path: "/", label: "Home" },
        { path: "/features", label: "Features" },
        { path: "/about", label: "About" },
        { path: "/pricing", label: "Pricing" },
      ].map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
        >
          <span className="relative z-10 group-hover:text-blue-400">{label}</span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-400 transition-all duration-300 ease-in-out group-hover:w-full" />
        </Link>
      ))}
    </>
  );

  return (
    <nav className="w-full bg-gray-900/90 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 group">
  <img
    src="/Logo2.png"
    alt="Logo"
    className="h-10 w-10 rounded-md shadow-sm transition-transform duration-300 "
  />
  <span className="text-2xl font-extrabold text-white transition-all duration-500 group-hover:text-blue-500">
    TestimonialApp
  </span>
</Link>


        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-6 text-sm font-medium">
          {navLinks}
        </div>

        {/* Right buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {(!user) ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            
            <>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-blue-300 font-semibold shadow-sm border border-blue-500/20">
              {user.avatar? ( <img
          src={user.avatar}
          alt={user.Username}
          className="w-8 h-8 rounded-full"
        />) : (<>👋 Hi, <span className="text-white">{user.Username}</span> </>)}
                
              
              </span>
              <Form method="post" action="/logout" replace>
                <button
          type="submit"
          disabled={isLoggingOut}
          className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 transform ${
            isLoggingOut ? "cursor-not-allowed opacity-70" : "hover:scale-105 hover:shadow-lg"
          } flex items-center gap-2`}
        >
          {isLoggingOut && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {isLoggingOut ? "Logging out ..." : "Logout"}
          
        </button>

              </Form>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden text-white transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden px-6 pt-2 pb-4 space-y-3 text-white transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
        }`}
      >
        <div className="flex flex-col space-y-2 group">{navLinks}</div>

        {!user ? (
          <>
            <Link
              to="/login"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-fit transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-fit transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="block text-sm bg-white/10 px-4 py-2 rounded-full text-blue-300 font-semibold shadow-sm border border-blue-500/20">
              👋 Hi, <span className="text-white">{user.email}</span>
            </span>
            <Form method="post" action="/logout" replace>
              <button
                type="submit"
                className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-fit transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Logout
              </button>
            </Form>
          </>
        )}
      </div>
    </nav>
  );
}
