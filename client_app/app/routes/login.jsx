import { json, redirect } from "@remix-run/react";
import { useActionData, Link } from "@remix-run/react";
import LoginForm from "../components/LoginForm.jsx";

const API_URL = import.meta.env.VITE_API_URL;




export async function action({ request }) {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");

  if (!email || !password) {
    return json({ error: "Email or password is missing" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return json(
        { error: errorData.message || "Login Failed!" },
        { status: errorData.status || 500 }
      );
    }

    // Extracting  cookies from backend response headers
  const cookies = res.headers.get("Set-Cookie");

    return redirect("https://testimonia-delta.vercel.app/space" ,
      
      {
        headers:{
          "Set-Cookie": cookies,
        }
      }
        
      

    );
  } catch (err) {
    return json(
      { error: "Something went wrong. Please try again.", details: err.message },
      { status: 500 }
    );
  }
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6 tracking-tight">
        {/* <h3 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-6 relative"> */}
  <span className="after:content-['👋'] after:text-3xl after:ml-2">
    Welcome back
  </span>
{/* </h3> */}


        </h2>

        {actionData?.error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg p-3">
            {actionData.error}
          </div>
        )}

        <LoginForm />

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-700 transition duration-200 underline underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
