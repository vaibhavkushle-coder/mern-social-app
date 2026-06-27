import { useState } from "react";
import Input from "../components/input";
import axios from "axios";

function ChangePassword(){

    const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");

    async function handleChangePassword(){

        if(!oldPassword || !newPassword){
            toast.success("Fil all fields");
            return;
        }

        if(newPassword.length<6){
          toast.success("Password must be at least 6 characters");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await axios.put(

            "https://mern-social-app-xdit.onrender.com/change-password",

            {
                oldPassword,
                newPassword
            },

            {
                headers:{
                    Authorization:token
                }
            }
        );

        toast.success(response.data.message);
    }

    return(
        <div className="min-h-screen flex justify-center 
        items-center bg-gray-100 p-5">

            <div className="bg-white p-8 rounded-xl
             shadow-lg w-full max-w-md ">

                <h1 className="font-bold mb-11 text-3xl text-center"
                >🔒 Change Password</h1>
                

       <div className="flex flex-col gap-4">
       
       <Input
       type="password"
       placeholder=" Enter Old Password"
       value={oldPassword}
       onChange={(e)=>
        setOldPassword(e.target.value)
       }/>

       <Input

       type="password"
       placeholder="Enter New Password"
       value={newPassword}
       onChange={(e)=>setNewPassword(e.target.value)
       }/>

       </div>

       <button className="bg-blue-500 text-white py-3
       rounded-lg mt-4 w-full hover:scale-105 transition-all
       font-semibold cursor-pointer"
       onClick={handleChangePassword}
       >
        Change Password
       </button>


        </div>
        </div>

    );
}

export default ChangePassword;