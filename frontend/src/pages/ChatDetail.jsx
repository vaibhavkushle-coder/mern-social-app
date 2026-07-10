import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Input from "../components/input";
import axios from "axios";
import socket from "../socket";

function ChatDetail(){

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isTyping,setIsTyping] = useState(false);

    const { id } = useParams();
    const messagesEndRef = useRef(null);
    const typingTimeout = useRef(null);

    useEffect(()=>{
      
        socket.on("typing",(data)=>{
            setIsTyping(true);
        });

        socket.on("stopTyping",()=>{
            setIsTyping(false);
        });
    });

    useEffect(()=>{
        
        socket.on("onlineUsers",(data)=>{
            setOnlineUsers(data);
        });

        return()=>{
            socket.off("onlineUsers");
        };
    });

   useEffect(() => {
    socket.on("newMessage", (message) => {
        setMessages((prev) => [...prev, message]);

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }, 100);
    });

    return () => {
        socket.off("newMessage");
    };
}, []);

    useEffect(()=>{

        async function connectSocket(){

            socket.connect();

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/profile",
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            socket.emit("join",response.data.user._id);
        }

        connectSocket();
        return () => {
            socket.disconnect();
        };
    },[]);

    useEffect(()=>{

        messagesEndRef.current?.scrollIntoView({
            behavior:"smooth"
        });
    },[messages]);

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
                `https://mern-social-app-xdit.onrender.com/message/${conversationId}`,
                
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

            setMessages((prev)=>[...prev,response.data]);
                        setText("");


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

        <p className={onlineUsers[id]?
            "text-green-500" : "text-gray-500"
        }>
            {onlineUsers[id]?"🟢 Online":"⚫ Offline"}
        </p>

        <div className="bg-white rounded-xl shadow
        p-4 mb-4 h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                    NO messages yet 👋
                </p>
            ) : (
                messages.map((message)=>(
                    <div
                    key={message._id}
                    className={`mb-3 flex ${
                    message.sender?._id === currentUserId
                    ? "justify-end"
                    : "justify-start"

                    }`}
                    >

                        <div
                        className={`px-4 py-2 rounded-2xl
                            max-w-[70%] ${
                                message.sender?._id === currentUserId
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                            }`}
                            >
                                {message.text}


                                </div>
                                </div>

                        ))
            )}

            <div ref={messagesEndRef}></div>


        </div>

        {isTyping && (
            <p className="text-gray-500 text-sm">
                ✍️ Typing...
            </p>
        )}

        <Input
        value={text}
        onChange={(e)=>{

            setText(e.target.value);

            socket.emit("typing",{
                senderId:currentUserId,
                receiverId:id
            });

            clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(()=>{
                socket.emit("stopTyping");
            },3000);
        }}
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