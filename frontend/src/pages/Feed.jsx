import { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/input";

function Feed(){

    const [posts,setPosts] = useState([]);
    const [comment,setComment] = useState("");

    useEffect(()=>{
        getFeed();
    },[]);

    async function getFeed(){

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/feed"
        );
        setPosts(response.data);
    }

    async function handleLike(id){
        await axios.put(
            `https://mern-social-app-xdit.onrender.com/post/like/${id}`
        );
        getFeed();
    }

    async function handleComment(id){

        const token = localStorage.getItem("token");

        await axios.post(
            `https://mern-social-app-xdit.onrender.com/post/comment/${id}`,
            {
                text: comment
            },

            {
                headers:{
                    Authorization: token
                }
            }
        );

        setComment("");
        getFeed();
    }

    return(
        <div className="min-h-screen bg-gray-100 p-5 pb-24">

            <h1>🌏 Public Feed</h1>

           
            {
                posts.map((post)=>(
                    <div key={post._id}
                    className="bg-white p-5 rounded-xl shadow-lg
                    mb-5 max-w-xl mx-auto hover:shadow-2xl transition">

                        <div className="flex items-center gap-3 mb-3">

                         

                        <img
                        src={post.userId?.profilePic}
                        alt="profile"
                        width="50"
                        className="w-12 h-12 rounded-full object-cover
                        border-2 border-blue-500"
                        />
                        
                        <p className="font-semibold text-gray-700"
                        >{post.userId?.name}</p>

                        </div>

                        <p className="text-xs text-gray-500 mb-2">
                           🗓️ {new Date(post.createAt).toLocaleDateString()}
                        </p>

                                                <p>{post.createAt}</p>


                        <h2 className="text-2xl font-bold mb-2"
                        >{post.title}</h2>

                        <p className="text-gray-600"
                        >{post.content}</p>

                        <button
                        className="bg-pink-100 px-3 py-1 
                        rounded-lg mt-2 mb-1
                        hover:scale-105 transition"
                        onClick={()=>handleLike(post._id)}>
                           ❤️{post.likes}
                        </button>

                       

                        <Input
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        placeholder="Write a comment..."
                        />

                         <p className="text-sm text-gray-500 mt-2">
                           💬 {post.comments?.length || 0} comments

                        </p>


                        {
                            comment.trim() !== "" && (
                        
                        <button
                        className="bg-green-500 text-white p-2 
                        rounded-lg mt-2"
                        onClick={()=>handleComment(post._id)}
                        >
                           💬 Comment
                        </button>
                            )
                        }

                        {
                            post.comments?.slice(-2).map((comment,index)=>(

                                <p
                                key={index}
                                className="bg-gray-100 p-2 rounded-lg mt-2"
                                >
                                   💬 {comment.text}
                                </p>
                            ))
                        }
                        
                        </div>
                ))
            }
        </div>
    );
}

export default Feed;