import { json , redirect } from "@remix-run/react";


const API_URI = import.meta.env.VITE_API_URL;

export async function action({request}){
    const cookieHeader = request.headers.get("Cookie")
    const data = await request.formData();
    const spaceId = data.get("spaceId");

    if(!spaceId){
        return json({
            message: "No such space exists",
            status : 400
        })
    }

    try{
        const response = await fetch(`${API_URI}/api/v1/users/spaces/delete-space`, {
            method: "POST",
            headers:{
                 "Content-Type": "application/json",
                 cookie: cookieHeader
            },
            body: JSON.stringify({spaceId})
        })

        if(!response.ok){
            return json(
                {
                    message: "Something went wrong while deleting the space",
                    status: 401
                }
            )
        }

        return redirect("/space");


    }
    catch(err){
        return json({
            message: err.message || "Something went wrong",
            status: 403
        })

    }


}