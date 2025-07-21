import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/Navbar";
import { json } from "@remix-run/react";
import "./tailwind.css";
import { Toaster } from "react-hot-toast";
import { useMatches } from "@remix-run/react";





export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


const API_URL = import.meta.env.VITE_API_URL;

export const meta = () => {
  return [
    { title: "TestimonialApp" }, 
    {
      name: "description",
      content: "Create and manage beautiful testimonial spaces with ease.",
    },
  ];
};


export async function loader({ request }) {
  const cookieHeader = request.headers.get("cookie");

  try {
    const response = await fetch(`${API_URL}/api/v1/users/verify`, {
      method: "GET",
      headers: { cookie: cookieHeader || "" },
      credentials: "include",
    });

    if (response.status === 401) {
      throw redirect("/login");
    }

    if (!response.ok) {
      return json({ user: null }, { status: response.status });
    }

    const data = await response.json();

    if (!data?.user) {
      throw redirect("/login");
    }

    return json({ user: data.user });

  } catch (err) {
    console.error("Loader error:", err);
    return json({ user: null, error: "Error fetching user payload." }, { status: 500 });
  }
}

export default function App() {
  // const { user } = useLoaderData() ?? {};

  return (
    <Outlet />
 );
}


export function Layout({ children }) {
  // const { user } = useLoaderData(); 

   const { handle } = useMatches().slice(-1)[0] ?? {};
  const skipLayout = handle?.skipLayout;

  if (skipLayout) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" href="/Logo2.png" type="image/png" />

          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }



  let user = null;

  try {
    const data = useLoaderData();
    user = data?.user || null;
  } catch (err) {
    user = null;
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Logo2.png" type="image/png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user} /> 
        <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#0f172a", // Tailwind slate-900
      color: "#ffffff",
      padding: "12px 16px",
      fontSize: "14px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    success: {
      iconTheme: {
        primary: "#10b981", // Tailwind emerald-500
        secondary: "#d1fae5",
      },
      style: {
        background: "#052e16", // darker green
        border: "1px solid #10b981",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444", // Tailwind red-500
        secondary: "#fee2e2",
      },
      style: {
        background: "#450a0a", // darker red
        border: "1px solid #ef4444",
      },
    },
  }}
/>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6">{children}

          
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

