import { json, redirect , useLoaderData } from "@remix-run/react";
import { requireUser } from "../../../utilities/requireUser";
import SpaceForm from "../components/SpaceForm";

const API_URI = import.meta.env.VITE_API_URL;

export async function loader({ params, request }) {
  const user = await requireUser(request);
  const spaceId = params.id;
  const cookieHeader = request.headers.get("Cookie");

  const res = await fetch(`${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Response("Failed to load space", {
      status: res.status,
    });
  }

  const space = await res.json();
  return json({ space });
}

export async function action({ params, request }) {
  const user = await requireUser(request);
  const cookieHeader = request.headers.get("Cookie");
  const spaceId = params.id;
  const formData = await request.formData();

  const avatar = formData.get("avatar");

  const payload = {
    spaceId,
    name: formData.get("name"),
    HeaderTitle: formData.get("HeaderTitle"),
    customMessage: formData.get("customMessage"),
    description: formData.get("description"),
  };

  try {
    const res = await fetch(`${API_URI}/api/v1/users/spaces/update-space`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Response("Failed to update space", {
        status: res.status,
      });
    }


     if (avatar && avatar.size > 0) {
    const avatarFormData = new FormData();
    avatarFormData.append("avatar", avatar);
    avatarFormData.append("spaceId", spaceId);

    const updateAvatarRes = await fetch(`${API_URI}/api/v1/users/spaces/update-avatar`, {
      method: "PATCH",
      headers: {
        Cookie: cookieHeader,
      },
      body: avatarFormData,
    });

    if (!updateAvatarRes.ok) {
      throw new Response("Failed to update avatar", { status: updateAvatarRes.status });
    }
  }

    return redirect("/space");
  } catch (err) {
    console.error("Update space error:", err);
    throw new Response("Unexpected error", { status: 500 });
  }
}

export default function Edit() {
  const {space} = useLoaderData()
  const spaceData = space.data
  console.log(space);

  return (
   
      <SpaceForm
  initialData={spaceData}
  method="post" 
  action={`/space/${spaceData._id}/edit`}
  isEdit={true}
/>
  
  );
}
