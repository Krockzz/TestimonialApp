import { Link, useNavigation } from "@remix-run/react";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({ type = "register", error }) {

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"; 
  
  const isRegister = type === "register";

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
      
      <div className="max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300 animate-fade-in-up">
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight space-x-4">
          <span className="after:content-['🤗'] after:ml-2">{isRegister ? "Sign up for free" : "Welcome Back"}</span>
        </h2>

        {error && (
          <div className="text-red-500 bg-red-100 dark:bg-red-400/10 border border-red-400 px-4 py-2 rounded-md text-sm animate-pulse">
            {error}
          </div>
        )}

        <form method="post" className="space-y-5">
          {isRegister && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-1 transition-all group-hover:text-blue-400">
                Name
              </label>
              <input
                name="Username"
                type="text"
                placeholder="your first name"
                required
                className="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 
  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
  hover:ring-2 hover:ring-white transition duration-200"

              />
            </div>
          )}

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1 transition-all group-hover:text-blue-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 
  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
  hover:ring-2 hover:ring-white transition duration-200"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1 transition-all group-hover:text-blue-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 
  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
  hover:ring-2 hover:ring-white transition duration-200"
            />
          </div>
          
          <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full py-2.5 px-4 font-semibold rounded-xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-400/50 active:scale-100 flex items-center justify-center ${
    isSubmitting
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:scale-105 hover:shadow-2xl"
  }`}
>
  {isSubmitting ? (
    <div className="flex items-center gap-2 text-white">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      {isRegister ? "Registering..." : "Logging in..."}
    </div>
  ) : (
    <span>{isRegister ? "Sign Up" : "Login"}</span>
  )}
</button>



        </form>

        <p className="text-center text-sm text-gray-400">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
      

<Link
  to={isRegister ? "/login" : "/register"}
  className="text-blue-500 hover:text-blue-600 underline underline-offset-4 transition duration-200"
>
  {isRegister ? "Login" : "Sign Up"}
</Link>

        </p>

          <div className="flex items-center my-6">
        <div className="flex-grow h-[1px] bg-gray-700"></div>
        <span className="mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow h-[1px] bg-gray-700"></div>
      </div>

      
      <a
        href="http://localhost:8000/api/v1/auth/google"
        className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl shadow-md bg-white text-gray-700 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </a>
      </div>
    </div>
  );
}
