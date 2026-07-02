import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Input from "../components/input";
import axios from "axios";

function ChatDetail(){

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");

    const { id } = useParams();

    useEffect(()=>{
        getProfile();
        getOrCreateConversation();
    },[]);


    async function getOrCreateConversation(){

        try{

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `https://mern-social-app-xdit.onrender.com/conversation/${id}`,
                {
                    receiverId: id
                },
                {
                    headers:{
                        Authorization: token
                    }
                }

            );

            setConversation(response.data);
            getMessages(response.data._id);

        }catch(error){
            console.error(error);
        }
    }

    async function getMessages(conversationId){

        try{
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `https://mern-social-app=xdit.onrender.com/messages/${conversationId}`,
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setMessages(response.data);
        } catch(error){
            console.error(error);
        }
    }

    async function sendMessage(){
        try{

            if(!text.trim()) return;

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://mern-social-app-xdit.onrender.com/message",
                {
                    conversationId: conversation._id,
                    text
                },
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setText("");
            getMessages(conversation._id);

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
            );

            setCurrentUserId(response.data.user._id);
        } catch(error){
            console.log(error);
        }
    }

    return(

        <div className="p-5"> 

        <h1 className="text-2xl font-bold">
           💬 Chat
        </h1>

        <p>User Id: {id}</p>

        <div className="">
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                    NO messages yet 👋
                </p>
            ) : (
                messages.map((message)=>(
                    <div
                    key={message._id}
                    className={`mb-3 flex ${
                    message.sender === currentUserId
                    ? "justify-end"
                    : "justify-start"

                    }`}
                    >

                        <div
                        className={`px-4 py-2 rounded-2xl 
                            max-w-[70%] ${
                                message.sender === currentUserId
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                            }`}
                            >
                                {message.text}

                                </div>
                                </div>

                        ))
            )}

        </div>

        <Input
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Type a message..."
        />

        <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
        onClick={sendMessage}
        >
            Send
        </button>

        </div>
    );
}

export default ChatDetail;