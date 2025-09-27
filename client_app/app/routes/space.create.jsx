import { json, useLoaderData, useNavigate , redirect } from "@remix-run/react";
import SpaceForm from "../components/SpaceForm";
import Modal from "../components/Modal";
import { requireUser } from "../../../utilities/requireUser";



const API_URI = import.meta.env.VITE_API_URL;
console.log(`So the uri is : ${API_URI}`)

export async function loader({request}){

  
  const user = await requireUser(request);
  return json({user});
  
  
    
  
}


export async function action({ request }) {
  const data = await request.formData();
  // console.log(data)

  const name = data.get("name");
  const HeaderTitle = data.get("HeaderTitle");
  const description = data.get("description");
  const customMessage = data.get("customMessage");
  const avatar = data.get("avatar"); // File object

  if ([name, HeaderTitle , description, customMessage].some((field) => field.trim() === "") || !avatar || avatar.size === 0) {
    return json(
      {
        status: 400,
        message: "All fields are required",
      },
      { status: 400 }
    );
  }

const formData = new FormData();
formData.append("name", name);
formData.append("HeaderTitle", HeaderTitle);
formData.append("description", description);
formData.append("customMessage", customMessage);
formData.append("avatar", avatar); // file object

  
  const cookieHeader  = request.headers.get("cookie");
  try{
  const response = await fetch(`${API_URI}/api/v1/users/spaces/create-space` , 
    {
      method: "POST",
      headers: {
        cookie : cookieHeader
      },
      credentials: "include",
      body: formData
    }
  )

  if(!response.ok){
    return json({
      message: "Something went wrong",
      status : 400
    })
  }

  return redirect("/space")
}
catch(err){

}
 
}



export default function create(){
    //  const navigate = useNavigate();

    
   return(
    // <Modal onClose={closeFunction}>
        <SpaceForm  initialData={{}}         
      method="post"                  
      action="/space/create"         
      isEdit={false}  />
        
        // </Modal>
   )
}