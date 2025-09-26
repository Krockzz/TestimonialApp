import { Form, useNavigation, Link } from "@remix-run/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm({ error }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      {error && (
        <div className="text-red-500 bg-red-100 dark:bg-red-400/10 border border-red-400 px-4 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            disabled={isSubmitting}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-white hover:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            disabled={isSubmitting}
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-white hover:ring-2"
          />
        </div>

        <div className="text-left text-start">
          <Link
            to="/forgot-password"
            className="relative inline-block text-blue-400 hover:text-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 after:block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 font-semibold rounded-xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-400/50 ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:scale-105 hover:shadow-2xl active:scale-100"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </Form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow h-[1px] bg-gray-700"></div>
        <span className="mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow h-[1px] bg-gray-700"></div>
      </div>

      {/* Continue with Google */}
      <a
        href="https://testimonialapp.onrender.com/api/v1/auth/google/callback"
        className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl shadow-md bg-white text-gray-700 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </a>
    </>
  );
}
