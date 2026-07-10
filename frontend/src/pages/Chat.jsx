import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Chat(){
     
    const [conversations, setConversations] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        getConversations();
        getProfile();
    },[]);

    async function getConversations(){
        try{

            const token = localStorage.getItem("token");

           const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/conversations",
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setConversations(response.data);

        }catch(error){
            console.error(error);
        }
    }

 async function getProfile(){
    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "https://mern-social-app-xdit.onrender.com/profile",
            {
                headers:{
                    Authorization: token
                }
            }
        )
        setCurrentUserId(response.data.user._id);

    } catch (error){
        console.log(error);
    }
 }

    return(
        <div className="p-5">

            <h1 className="text-2xl font-bold mb-5 text-center">
               💬 Chats
            </h1>

            {
                conversations.map((conversation)=>{
                     const OtherUser = 
                     conversation.participants.find(
                        (user)=>user._id !== currentUserId
                     );

                     return(

                        <div
                        key={conversation._id}
                        onClick={()=>navigate(`/chat/${OtherUser._id}`)}
                        className="bg-white shadow rounded-xl 
                        p-4 mb-3 flex items-center gap-3
                        cursor-pointer hover:bg-gray-100 transition">

                            <img src={OtherUser.profilePic}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover border"
                            />
                      
                      <div>
                            <p className="font-semibold text-lg">
                                {OtherUser.name}</p>
                       </div>     

                        </div>
                     )
                })
            }

         
        </div>
    );
}
export default Chat;