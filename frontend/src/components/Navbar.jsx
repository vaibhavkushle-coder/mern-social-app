import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
function Navbar(){

const {token,setToken}=useAuth();

   const navigate = useNavigate();

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

    <div className="flex justify-between items-center
     bg-slate-900 text-white p-4 mt-2 ml-2 mr-2 rounded-lg
     sticky top-2 z-50">


        {

            token?

         <div className="flex flex-wrap gap-4 items-center justify-center">

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