import { redirect } from "@remix-run/react";
import { json } from "@remix-run/react";

const API_URI = import.meta.env.VITE_API_URL;
export const handle = { skipLayout: true };

/* ---------------- LOADER ---------------- */
export async function loader({ request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return json(
      { success: false, message: "Invalid verification link" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${API_URI}/api/v1/users/Testimonial/verify-email?token=${token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned invalid response");
    }

    if (!res.ok) {
      return json(
        { success: false, message: data.message || "Verification failed" },
        { status: res.status }
      );
    }

  
    return redirect("/verified");

  } catch (error) {
    return json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- UI ---------------- */
export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">
        Verifying your email, please wait...
      </p>
    </div>
  );
}
