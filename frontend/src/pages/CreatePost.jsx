import { useState } from "react";
import axios from "axios";
import Input from "../components/input";
import { useNavigate} from "react-router-dom";

function CreatePost(){

    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [image,setImage] = useState(null);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);

    async function handleSubmit(){

        if(!title || !content){
            alert("Fill all fields");
            return;
        }
        
        const token = localStorage.getItem("token");

        setLoading(true);

        const response = await axios.post(

            "https://mern-social-app-xdit.onrender.com/post",
            {
                title,
                content
            },
            {
                headers:{
                    Authorization:token
                }
            }
        );
        alert(response.data.message);
        setLoading(false);
        setTitle("");
        setContent("");
        navigate("/posts");
    }

    function navigateToPosts(){
        navigate("/posts");
    }

    return(

        <div className=" min-h-screen flex justify-center 
        items-center bg-gray-100 p-5">

            <div className="bg-white p-8 rounded-xl shadow-lg 
            hover:shadow-2xl transition-all duration-300
            w-full max-w-md">

<h1 className="text-3xl font-bold mb-4 text-center mt-4"
>📝 Create Post</h1>

<div  className="flex flex-col gap-4">

        <Input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-3 rounded-lg w-full
            resize-none h-32 outline-none"
        />

        <input
        type="file"
        accept="image/*"
        onChange={(e) =>
            setImage(e.target.files[0])
        }/>

        <button className="bg-green-500 text-white p-3 rounded-lg
         mt-4 text-center hover:scale-105 transition-all w-full
         font-semibold cursor-pointer disabled={loading}"
         
        onClick={handleSubmit}>
            {loading?"Loading...":"📝 Create Post"}
        </button>

        </div>

                <button className="bg-blue-500 text-white p-3 
                rounded-lg mt-4 w-full hover:scale-105  transition-all
                font-semibold cursor-pointer"
        onClick={navigateToPosts}
        >
           👁️ View All Posts
        </button>


        </div>

        </div>
    );
}

export default CreatePost;