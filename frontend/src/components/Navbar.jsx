import { Link, useNavigate, NavLink } from "react-router-dom";
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

    <div className="bg-slate-900 text-white p-4 sticky top-0 z-50">


        {

            token?   

         <div className="hidden flex justify-center gap-3 flex-wrap">

            <h1 className="text-xl font-bold text-center"
            >🚀MERN Social</h1>

           

            <Link className="px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            
            to="/profile">
            
            🤵‍♂️Profile

            </Link>
            
            <Link className="px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            to="/">

            🏠Home

            </Link>

            <Link className="px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            to="/create-post">

            ✍️Create Post
            
            </Link>

            <Link className="px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            to="/feed">
            
           🌏 Feed

            </Link>


            <button 
            
            onClick={handleLogout}
            
            className="px-4 py-2 rounded-lg hover:bg-slate-700 transition"

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
        <div className="fixed bottom-4 left-1/2-translate-x-1/2
         w-[95%] max-w-md bg-slate-900 text-white 
         flex justify-around item-center py-3
        rounded-2xl shadow-2xl z-50">

            <NavLink to="/" className={({isActive})=>
            isActive
            ? "text-2xl p-2 bg-blue-500 rounded-full"
            : "text-2xl p-2"
            }
            >
                🏠
            </NavLink>

            <NavLink to="/feed" className={({isActive})=>
            isActive
            ? "text-2xl p-2 bg-blue-500 rounded-full"
            : "text-2xl p-2"
            }
            >
                🌏
            </NavLink>

            <NavLink to="/create-post" className={({isActive})=>
            isActive
            ? "text-2xl p-2 bg-blue-500 rounded-full"
            : "text-2xl p-2"
            }
            >
                ➕
            </NavLink>

            <NavLink to="/profile" className={({isActive})=>
            isActive
            ? "text-2xl p-2 bg-blue-500 rounded-full"
            : "text-2xl p-2"
            }
            >
                👤
            </NavLink>

            <button onClick={handleLogout} className="text-2xl p-2">
                🚪
            </button>
        </div>

    </div>
   );
}

export default Navbar;