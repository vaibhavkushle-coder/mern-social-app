import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Input from "../components/input";
import axios from "axios";
import socket from "../socket";

function ChatDetail(){

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [selectedImage, setSelectedImage]= useState(null);
    const [currentUserId, setCurrentUserId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isTyping,setIsTyping] = useState(false);

    const { id } = useParams();
    const messagesEndRef = useRef(null);
    const typingTimeout = useRef(null);
    const fileInputRef = useRef(null);
    const textAreaRef = useRef(null);

    console.log("Current User ID:",currentUserId);
    console.log(messages);

   
useEffect(() => {

    messages.forEach((message) => {

        console.log("Sender:", message.sender._id);
        console.log("Current:", currentUserId);
        console.log(
            "Equal ?",
            message.sender._id.toString() === currentUserId
        );

        if (
            message.sender._id.toString() !== currentUserId &&
            !message.seen
        ) {

            console.log("EMITTING MESSAGE SEEN");

            socket.emit("messageSeen", {
                messageId: message._id
            });

        }

    });

}, [messages, currentUserId]);
    useEffect(()=>{

        
      
        socket.on("typing",(data)=>{
            setIsTyping(true);
        });

        socket.on("stopTyping",()=>{
            setIsTyping(false);
        });
        

            socket.on("messageSeen",(data)=>{

                setMessages((prev)=>
                    prev.map((message)=>{
                        if(message._id===data.messageId){
                            return{
                                ...message,
                                seen:true
                            };
                        }
                        return message;
                    })
                );
            });

            return()=>{
                socket.off("typing");
                socket.off("stopTyping");
                socket.off("messageSeen");
            };
        
    },[]);

    useEffect(()=>{
        
        socket.on("onlineUsers",(data)=>{
            setOnlineUsers(data);
        });

        return()=>{
            socket.off("onlineUsers");
        };
    },[]);

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

            if(!conversation?._id) return;

            const formData = new FormData();

            formData.append("conversationId",conversation._id);
            formData.append("text",text);

            if(selectedImage){
                formData.append("image",selectedImage);
            }

            if(!text.trim() && !selectedImage) return;

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://mern-social-app-xdit.onrender.com/message",
                formData,
              
                {
                    headers:{
                        Authorization: token,
                        "Content-Type":"multipart/form-data"
                    }
                }
            );

            setMessages((prev)=>[...prev,response.data]);
            setText("");
            setSelectedImage(null);
            fileInputRef.current.value = "";


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

        <div className="p-5 pb-28"> 

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
        p-4 mb-4 h-[55vh] overflow-y-auto">
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

                                {message.image && (
                                    <img
                                    src={message.image}
                                    alt="chat"
                                    className="w-52 rounded-lg mb-2"
                                    />
                                )}
                                {message.text}

                                {message.sender?._id===currentUserId && (
                                    <p className="text-xs mt-1 text-right">
                                        {message.seen?"✔️✔️Seen":"✔️send"}
                                    </p>
                                )}


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

        {selectedImage && (
            <div className="mb-2">
                <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="w-32 h-32 object-cover
                rounded-lg border"
                />

                </div>
        )}

        <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="imageInput"
        className="hidden"
        onChange={(e)=>setSelectedImage(e.target.files[0])}
        />

        <label
        htmlFor="imageInput"
        className="bg-gray-200 px-3 py-2
        rounded-lg cursor-pointer "
        >{selectedImage?"🖼️Change image" : " 📷 Image"}</label>

        <Input
        value={text}

        onKeyDown={(e)=>{
            if(e.key==="Enter" && !e.shiftKey){
                e.preventDefault();
                sendMessage();
            }
        }}

        inputRef={textAreaRef}

        onChange={(e)=>{

            if(textAreaRef.current){
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.style.height = textAreaRef.current.scrollHeight+"px";
            }

            setText(e.target.value);

            socket.emit("typing",{
                senderId:currentUserId,
                receiverId:id
            });

            clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(()=>{
                socket.emit("stopTyping",{
                    senderId:currentUserId,
                    receiverId:id
                });
            },3000);
        }}
        placeholder="Type a message..."
        />

        <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
        onClick={sendMessage}
        >
           📤 Send
        </button>



        </div>
    );
}

export default ChatDetail;