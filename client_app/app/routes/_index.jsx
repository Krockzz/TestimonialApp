import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import Footer from "../components/Footer.jsx"
import {requireUser} from "../../utilities/requireUser.jsx"
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";

export async function loader(request){
  try{
    const user = await requireUser(request);
    return json({isAuthenticated: true})

  }
  catch{
   return json({isAuthenticated : false});
  }
}

export default function Home() {

  const {isAuthenticated} = useLoaderData()
  return (
    <div className="bg-gray-950 min-h-screen">
      <Hero isAuthenticated = {isAuthenticated}/>
      <Features />
      <Footer />
    </div>
  );
}
