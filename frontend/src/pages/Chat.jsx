import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function Chat(){
     
    const [conversations, setConversations] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{

        socket.on("conversationUpdate",(updatedConversation)=>{

          setConversations((prev)=>{
             
            const filtered = prev.filter(
                (conversation)=>
                    conversation._id !== updatedConversation._id
            );

            return [updatedConversation,...filtered];
          });
        });

        return()=>{
            socket.off("conversationUpdate");
        };

    },[]);

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

                     if(!OtherUser) return null;

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
                      
                      <div className="flex-1">
                            <p className="font-semibold text-lg">
                                {OtherUser.name}
                                </p>

                       <p className="text-gray-500 text-sm truncate">
                        {conversation.lastMessage || "No messages yet"}
                        </p>  

                        <p className="text-xs text-gray -400">
                            {
                                conversation.lastMessageTime?new
                                Date(conversation.lastMessageTime).toLocaleTimeString([],{
                                    hour:"2-digit",
                                    minute:"2-digit",
                                })
                                :""
                            }
                        </p>

                      </div>
   

                        </div>
                     )
                })
            }

         
        </div>
    );
}
export default Chat;