import { Form, useNavigation } from "@remix-run/react";

export default function Password() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
      <div className="max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300 animate-fade-in-up">
        <h2 className="text-center text-2xl font-bold text-white">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-400 text-center">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <Form method="post" className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
              className="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
                hover:ring-2 hover:ring-white transition duration-200"
            />
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
                Sending...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}
