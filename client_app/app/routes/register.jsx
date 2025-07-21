import { json, redirect } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import AuthForm from "../components/AuthForm.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export async function action({ request }) {
  const data = await request.formData();
  const Username = data.get("Username");
  const email = data.get("email");
  const password = data.get("password");

  if (!Username || !email || !password) {
    return json({ error: "Please provide all the fields" }, { status: 400 });
  }

  if (password.length < 6) {
    return json({ error: "Password should be at least 6 characters" }, { status: 400 });
  }

  try {
    // First, register the user
    const registerRes = await fetch(`${API_URL}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Username, email, password }),
    });

    if (!registerRes.ok) {
      const errorData = await registerRes.json();
      return json({
        error: errorData.message || "Registration Failed",
        statusCode: errorData.status || 400,
      });
    }

    // Then, log in the user (this will set the cookies)
    const loginRes = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // crucial to receive cookies
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      const loginError = await loginRes.json();
      return json({
        error: loginError.message || "Login after registration failed",
        statusCode: loginError.status || 500,
      });
    }

    // If login succeeds, redirect and auth state will update
    return redirect("/space");
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return json(
      {
        error: "Something went wrong. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}


export default function RegisterPage() {
  const actionData = useActionData();
  return <AuthForm type="register" error={actionData?.error} />;
}
