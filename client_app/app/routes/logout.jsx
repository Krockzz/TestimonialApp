import { redirect } from "@remix-run/node";

const API_URL = import.meta.env.VITE_API_URL;

export async function action({ request }) {
  try {
    const cookieHeader = request.headers.get("cookie");

    const res = await fetch(`${API_URL}/api/v1/users/logout`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(JSON.stringify({
        error: errorData.message || "Logout Failed!",
        status: errorData.status || 500,
      }), {
        status: errorData.status || 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get Set-Cookie headers from backend response
    const setCookieHeaders = res.headers.get("set-cookie");

    return redirect("/", {
      headers: {
        "Cache-Control": "no-store",
        ...(setCookieHeaders && { "Set-Cookie": setCookieHeaders }),
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong", status: 500 }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
