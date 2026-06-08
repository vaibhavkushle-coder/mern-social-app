import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
function Navbar(){

const [profile, setProfile] = useState({});

const {token,setToken}=useAuth();

   const navigate = useNavigate();

   useEffect(()=>{
    getProfile();
   },[]);

   async function getProfile(){

    try{

        const token = localStorage.getItem("token");

        const responce = await axios.get(

            "https://mern-social-app-xdit.onrender.com/profile",
            {
                headers:{
                    Authorization: token
                }
            }
        );

        setProfile(responce.data.user);

    }catch(error){
        console.log(error);
    }
   }

   function handleLogout(){

    const confirsLogout = window.confirm(
        "You want to logout this account"
    );

    if(!confirsLogout){
        return;
    }

    localStorage.removeItem("token");

    setToken("");

    alert("Logout successful");

    navigate("/login"); 

   }

   return(

    <div className="flex flex-col items-center
     bg-slate-900 text-white p-4 mt-2 ml-2 mr-2 rounded-lg
     sticky top-2 z-50">


        {

            token?   

         <div className="flex flex-wrap gap-4 items-center justify-center">

            <div>

                <img 
                src={profile.profilePic ||
                    "/user.png"}
                    alt="profile"
                    className="w-14 h-14 rounded-full
                border-2 border-blue-400 object-cover ml-8"
                    />

                    <p className="text-sm text-gray-300">
                        {profile.email}
                    </p>
                </div>

            <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-blue-500 rounded-lg hover:scale-105 
            transition-all duration-300 font-semibold"
            
            to="/profile">
            
            🤵‍♂️Profile

            </Link>
            
            <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-green-500 rounded-lg hover:scale-105 
            transition-all duration-300 font-semibold cursor-pointer"
            to="/">

            🏠Home

            </Link>

            <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-purple-500 rounded-lg hover:scale-105 
            transition-all duration-300 font-semibold cursor-pointer"
            to="/create-post">

            ✍️Create Post
            
            </Link>

            <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-cyan-600 rounded-lg hover:scale-105 
            transition-all duration-300 font-semibold cursor-pointer"
            to="/posts">
            
            📰Posts

            </Link>

            <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-pink-600 rounded-lg hover:scale-105 
            transition-all duration-300 font-semibold cursor-pointer"
            to="/feed">
            
           🌏 Feed

            </Link>

             <Link className="h-12 min-w-[140px] flex items-center 
            justify-center bg-amber-500 p-5 rounded-lg hover:scale-105
             transition-all duration-300 font-semibold cursor-pointer"
            to="/change-password">

            🔄Change Password

            </Link>



            <button 
            
            onClick={handleLogout}
            
            className="h-12 min-w-[140px] flex items-center 
            justify-center bg-red-500 rounded-lg hover:scale-105
            transition-all duration-300 font-semibold cursor-pointer"

            >
                🚪Logout
                
            </button>

            </div>

            :

            <>
            
            <div className="flex gap-4">

            <Link 
            
            to="/login"
            
            className="hover:text-blue-400 transition"

            >
            Login</Link>
            
           <Link
           
           to="/register"
           
          className="hover:text-blue-400 transition"


           >
           Register

           </Link>

           </div>

            </>
        }

    </div>
   );
}

export default Navbar;