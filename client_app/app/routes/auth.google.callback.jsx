import { redirect } from "@remix-run/node";

const API_URL = import.meta.env.VITE_API_URL;

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/login?error=true");
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/google/exchange?code=${encodeURIComponent(
        code
      )}`
    );

    if (!response.ok) {
      console.error(
        "Google token exchange failed:",
        response.status
      );

      return redirect("/login?error=true");
    }

    const data = await response.json();

    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `accessToken=${data.accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    headers.append(
      "Set-Cookie",
      `refreshTokens=${data.refreshTokens}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    return redirect("/space", {
      headers,
    });
  } catch (error) {
    console.error("Google callback error:", error);

    return redirect("/login?error=true");
  }
}