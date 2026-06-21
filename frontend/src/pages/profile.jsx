import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";

function Profile(){

    const [profile,setProfile]=useState({});
    const [isEditing,setIsEditing]=useState(false);
    const [loading,setLoading]=useState(false);
    const [image,setImage]=useState(null);
    const [showFollowers,setShowFollowers]=useState(false);
    const [showFollowing,setShowFollowing]=useState(false);

    const navigate = useNavigate();
    

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
                email:profile.email,
                name:profile.name
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

        try{

        const token = localStorage.getItem("token");

        const formData = new FormData();

        formData.append("image",image);

        const response = await axios.put(

            "https://mern-social-app-xdit.onrender.com/profile-photo",

            formData,

            {
                headers:{
                    Authorization: token
                }
            }
        );

setProfile({
    ...profile,
    profilePic: response.data.profilepic
});

    }catch(error){

            console.log(error.response?.data);

    }
    }

    return(

        <div className="p-10 min-h-screen flex justify-center
        items-center bg-gray-100 p-5 pb-24">

        <div className="bg-white p-8 rounded-xl shadow-lg 
        max-w-md w-full hover:shadow-2xl transition-all
        duration-300">

<h1 className="text-3xl font-bold mb-4 text-center">
    
    Profile
    
    </h1>


    {
        profile.profilePic ? (
            <img
            src={profile.profilePic}
            className="w-28 h-28 rounded-full mx-auto
            object-cover border-4 border-blue-500"
            />
        ) : (
            <div className="text-6xl text-center ">
                👤</div>
        )
    }
    <p className="text-center text-gray-500 mb-4"
    >@{profile.name}</p>

    <label className="cursor-pointer bg-gray-200
    px-4 py-2 rounded-lg block
    text-center mb-3">
       📂 Choose Photo

    <input 
    type="file"
    onChange={(e)=>setImage(e.target.files[0])}
    className="hidden"
    />

    </label>

    <button 
    onClick={handleUpload}
    className="w-full bg-blue-500 text-white
    py-1 rounded-lg hover:bg-blue-600
    transition mb-9">
       📸 Upload Photo
    </button>

    <div className="bg-gray-50 border rounded-lg p-4 mb-4">

        <p className="font-semibold text-lg"
        >👤 {profile.name}</p>

<p >
    
    📥Email: {profile.email}
    
    </p>

   <div className="flex gap-4 mt-3 flex-wrap">

    <button
    className="bg-blue-100 px-3 py-2 
    rounded-lg hover:bg-green-200 transition"
    onClick={()=>{
        setShowFollowers(!showFollowers);
        setShowFollowing(false);
    }}>
       👥 Followers: {profile.followers?.length || 0}
    </button>
    
    <button 
    className="bg-green-100 px-3 py-2
    rounded-lg hover:bg-green-200 transition"
    onClick={()=>{
        setShowFollowing(!showFollowing);
        setShowFollowers(false);
    }}>
       ➡️ Following: {profile.following?.length || 0}
    </button>
   </div>

    {
        isEditing && (
            <Input
            type="text"
            value={profile.name}
            onChange={(e)=>
                setProfile({
                    ...profile,
                    name:e.target.value
                })
            }
            />
        )
    }

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
    
    🪪ID: {profile._id}
    
    </p>

    </div>

    {
        showFollowers && (
            <div className="bg-white border rounded-lg p-4 mb-4">

                <h2 className="font-bold mb-3">👥 Followers</h2>

                {
                    profile.followers?.length > 0 ? (
                        
                        profile.followers.map((user)=>(
                            <div
                            key={user._id}
                            className="flex item-center gap-3 border-b py-2"
                            >
                                <img
                                src={user.profilePic || "/user.png"}
                                alt="profile"
                                />

                                <div>
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>

                                    </div>
                                    </div>
                        ))
                    ) : (
                        <p>No followers yet</p>
                    )
                }
            </div>
        )
    }

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
            {loading?"Saving...":"✔️ Save"}
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
<button
className="bg-cyan-600 text-white p-3
rounded-lg w-full mt-3
hover:scale-105 transition"
onClick={()=>navigate("/posts")}
>
   📄 My Posts
</button>

<button
className="bg-amber-500 text-white p-3
rounded-lg w-full mt-3
hover:scale-105 transition"
onClick={()=>navigate("/change-password")}
>
   🔄️ Change Password
</button>
        </div>

        </div>
    );
}

export default Profile;