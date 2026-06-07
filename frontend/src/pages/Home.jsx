import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useEffect, useState } from "react";

function Home(){

    const navigate = useNavigate();
    const [profile,setProfile]=useState({});

    useEffect(()=>{
        getProfile();
    },[]);


    async function getProfile(){

        try{

        const token = localStorage.getItem("token");

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/profile",

            {

                headers:{
                    
                    authorization:token

                }

            }

            );

            setProfile(response.data.user);

        }catch(error){

            localStorage.removeItem("token");

            navigate("/login");
        }
    }

    return(
        <div className="p-10 min-h-screen flex justify-center
        items-center bg-gray-100 p-5">

            <div className="bg-white p-8 rounded-xl shadow-lg
            w-full max-w-lg">

            <h1 className="text-3xl font-bold
             text-center mb-6"
            >Home page</h1>

            <h1 className="text-4xl font-bold mb-4 w-full max-w-sm">
                
                Welcome to MERN App
                
            </h1>

      {
        profile?

        <div className="bg-gray-50 p-5 rounded-lg border mt-6">



            <div className="flex items-center gap-3 mb-3">


                <img
                    src={profile.profilePic ||
                        "https://via.placeholder.com/100"}
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover border"
                        />

        <p className="text-lg text-gray-500">
            
           👋 Welcome, {profile.email}
            
        </p>

        </div>

        <h2> 🪪 ID: {profile._id}</h2>

        </div>

        :

        <h2 >Loading...</h2>

      }

        </div>
        </div>
    );
}

export default Home;
