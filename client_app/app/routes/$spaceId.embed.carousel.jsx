import { useLoaderData, useNavigation, useLocation, useSearchParams } from "@remix-run/react";
import WallCarousel from "../components/WallCarousel";
import { json } from "@remix-run/node";


const API_URI = import.meta.env.VITE_API_URL;

export const handle = { skipLayout: true };

export async function loader({ request, params }) {
  const spaceId = params.spaceId;
  const cookieHeader = request.headers.get("Cookie");

  let response;

  try {
    response = await fetch(`${API_URI}/api/v1/users/Testimonial/getTestimonials/${spaceId}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });
  } catch (error) {
    console.log("Error fetching testimonials:", error);
    throw new Response("Failed to load testimonials", { status: 500 });
  }

  const data = await response.json();
  const result = data.data.docs;

  const featuredTestimonials = result.filter(t => t.featured?.enabled === true);

  let response2;
  try{
     response2 = await fetch(`${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    }); 

  }
  catch(error){
    console.log("Error fetching space details:", error);
    throw new Response("Failed to load space details", { status: 500 });

  }

  const data2 = await response2.json();
  console.log("Space Details:", data2);

  const spaceDetails = data2.data;
  console.log("Space Details Extracted:", spaceDetails);

  return json({ featuredTestimonials, spaceId , spaceDetails });
}

export default function EmbedWall() {
  const { featuredTestimonials, spaceDetails } = useLoaderData();
  const [searchParams] = useSearchParams();

  const theme = searchParams.get("theme") || "light";
  const cardSize = searchParams.get("cardSize") || "medium";
  const bg = searchParams.get("bg") || "transparent";
  const mode = searchParams.get("mode") || "manual";

  return (
   <div
  style={{
    minHeight: "200px",
    background: bg === "transparent" ? "transparent" : bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  }}
>
  <WallCarousel
    testimonials={featuredTestimonials}
    theme={theme}
    cardSize={cardSize}
    bg={bg}
    mode={mode}
    spaceDetails={spaceDetails}
  />
</div>
  );
}