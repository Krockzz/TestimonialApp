import { redirect } from "@remix-run/react";

const API_URI = import.meta.env.VITE_API_URL;

export async function requireUser(request) {
  const cookieHeader = request.headers.get("Cookie");

  try {
    const response = await fetch(`${API_URI}/api/v1/users/verify`, {
      method: "GET",
      headers: { cookie: cookieHeader || "" },
      credentials: "include",
    });

    if (!response.ok) {
      throw redirect("/login");
    }

    const data = await response.json();

    if (!data?.user) {
      throw redirect("/login");
    }

    return data.user;
  } catch (err) {
    console.error("Error during user verification:", err);
    throw redirect("/login");
  }
}
