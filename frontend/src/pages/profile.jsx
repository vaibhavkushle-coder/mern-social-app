import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/input";

function Profile(){

    const [profile,setProfile]=useState({});
    const [isEditing,setIsEditing]=useState(false);
    const [loading,setLoading]=useState(false);
    const [image,setImage]=useState(null);
    

    useEffect(()=>{

        getProfile();

    },[]);

    async function getProfile(){

        const token = localStorage.getItem("token");

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/profile",

            {
                headers:{
                    Authorization:token
                }
            }

        );

        setProfile(response.data.user);

    }

    async function handleSave(){
          
        const token = localStorage.getItem("token");

        setLoading(true);

        const response = await axios.put(

            "https://mern-social-app-xdit.onrender.com/profile",

            {
                email:profile.email
            },

            {
                headers:{
                    authorization:token
                }
            }
        );

        alert(response.data.message);

        setLoading(false);

        setIsEditing(false);
    }

    async function handleUpload(){

        const token = localStorage.getItem("token");

        const formData = new FormData();

        formData.append("image",image);

        const response = await axios.put(

            "https:/mern-social-app-xdit.onrender.com/profile-photo",

            formData,

            {
                headers:{
                    Authorization: token
                }
            }
        );

        console.log(response.data);
    }

    return(

        <div className="p-10 min-h-screen flex justify-center
        items-center bg-gray-100 p-5">

        <div className="bg-white p-8 rounded-xl shadow-lg 
        max-w-md w-full hover:shadow-2xl transition-all
        duration-300">

<h1 className="text-3xl font-bold mb-4">
    
    Profile
    
    </h1>

    <div className="text-6xl text-center mb-4">👤</div>

    <input 
    type="file"
    onChange={(e)=>setImage(e.target.files[0])}
    />

    <button onClick={handleUpload}>
        Upload Photo
    </button>

    <div className="bg-gray-50 border rounded-lg p-4 mb-4">

<p >
    
    📥Email: {profile.email}
    
    </p>

{
    isEditing && (
        <Input
        type="email"
        value={profile.email}
        onChange={(e)=>
            setProfile({
                ...profile,
                email:e.target.value
            })
        }
        />
    )
}
<p>
    
    🪪ID: {profile.id}
    
    </p>

    </div>

{
    !isEditing?(
        <button className="bg-blue-500 text-white px-4 py-2
        rounded-lg mt-4 hover:scale-105 transition-all
         duration-300 font-semibold cursor-pointer"
        onClick={()=>setIsEditing(true)}
        >
           ✏️ Edit Profile
        </button>
    ):(

<div>

        <button className="bg-green-500 text-white px-4 py-2
        rounded-lg mt-4 hover:scale-105 transition-all 
        duration-300 disabled={loading}"
        onClick={handleSave}
        >
            {loading?"Seving...":"✔️ Save"}
        </button>

        <button className="bg-gray-500 text-white px-4 py-2 
        rounded-lg mt-4 ml-2 hover:scale-105 transition-all duration-300"
        onClick={()=>{
            setIsEditing(false);
            getProfile();
        }}
        >
           ❌ Cancel
        </button>

        </div>
    )
}
        </div>

        </div>
    );
}

export default Profile;