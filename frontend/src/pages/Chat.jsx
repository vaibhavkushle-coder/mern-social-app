import { useState, useEffect } from "react";
import axios from "axios";

function Chat(){
     
    const [conversations, setConversations] = useState([]);

    useEffect(()=>{
        getConversations();
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

    return(
        <div className="p-5">

            <h1 className="text-2xl font-bold mb-5 text-center">
               💬 Chats
            </h1>

            {
                conversations.map((conversation) =>(

                    <div 
                    key={conversation._id}
                    className="bg-white shadow rounded-xl p-4 mb-3
                     cursor-pointer hover:bg-gray-100 transition duration-300"
                    >
                        {
                            conversation.participants.map((user)=>(
                                <div key={user._id}>

                                    <img
                                    src={user.profilePic}
                                    alt="profile"
                                    className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <p>{user.name}</p>
                                    </div>
                            ))
                        }
                    </div>
                ))
            }
            
        </div>
    );
}
export default Chat;