import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/input";
import { useParams } from "react-router-dom";

function PostDetail(){
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");

    useEffect(()=>{
        getPost();
        getCurrentUser();
    },[]);

    async function getPost(){

        try{

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `https://mern-social-app-xdit.onrender.com/post/${id}`,
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setPost(response.data);
            setLoading(false);

        } catch(error){
            console.log("POST DETAIL ERROR =>",error);
            setLoading(false);
        }
    }

    async function getCurrentUser(){
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

        }catch(error){
            console.log("CURRENT USER ERRRO =>",error);
        }
    }

    async function handleLike(){
        try{

            const token = localStorage.getItem("token");

            await axios.put(
                `https://mern-social-app-xdit.onrender.com/post/like/${id}`,
                {},
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            getPost();

        }catch(error){
            console.log("LIKE ERROR =>",error);
        }
    }

    async function handleComment() {
        try{
            const token = localStorage.getItem("token");

            if(!comment.trim()) return;

            await axios.post(
                `https://mern-social-app-xdit.onrender.com/post/comment/${id}`,
                { text: comment },
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setComment("");
            getPost();

        }catch(error){
            console.log("COMMENT ERROR =>",error);
        }
    }

    if (loading) {
        return <div className="text-center mt-10">
           ⌛ Loading Post...
        </div>
    }

    if (!post) {
        return <div className="text-center mt-10">
            Post not found 😔
        </div>
    }

    const isLiked = post.likes?.some(
        (likeUserId) => likeUserId.toString() ===
        currentUserId
    );

    return(
        
        <div className="min-h-screen bg-gray-100 p-5 pb-24">
            
            <div className="bg-white max-w-2xl mx-auto
            p-5 rounded-xl shadow-lg">

                <div className="flex items-center gap-3 mb-4">

                    {post.userId?.profilePic ? (

                    <img
                    src={post.userId?.profilePic}
                    alt="profile"
                    className="w-12 h-12 rounded-full 
                    object-cover border"
                    />
                    ) : ( 
                        <div className="w-12 h-12 rounded-full
                        bg-gray-300 flex items-center justify-center">
                            👤
                            </div>
                    )}

                    <div>

                        <h2 className="font-bold">
                            {post.userId?.name}
                        </h2>

                        <p className="text-sm text-gray-500 mb-2">
                            {post.userId?.email}
                        </p>
                        
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                   🗓️ {new Date(post.createdAt).toLocaleString()}
                </p>

                <h1 className="text-2xl font-bold mb-2">
                    {post.title}
                </h1>
                
                <p className="text-gray-700 mb-4">
                    {post.content}
                </p>

                <div className="flex gap-4 items-center mb-4">

                    <button className={`px-3 py-1 rounded-lg ${
                        isLiked ?
                        "bg-red-300" : "bg-pink-100"
                    }`}
                    onClick={handleLike}
                    >
                        {isLiked ? "❤️" : "🤍"}
                        {post.likes?.length || 0}
                    </button>

                    <p className="text-sm text-gray-600">
                       🗨️ {post.comments?.length || 0} comments
                    </p>
                </div>

                <Input
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                placeholder="Write a comment..."
                />

                {( comment || "").trim() !== "" && (
                    <button
                    className="bg-green-500 text-white p-2 rounded-lg mt-2"
                    onClick={handleComment}
                    >
                       🗨️ Comment
                    </button>
                )}

                <div className="mt-5">

                    <h2 className="text-lg font-bold mb-3">
                        All comments</h2>

                    {post.comments?.length === 0 ? (
                        <p className="text-gray-500">
                            No comments yet 😔
                        </p>
                    ) : (
                        post.comments.map((comment,index)=> (
                            <div
                            key={index}
                            className="bg-gray-100 p-3 rounded-lg mb-3"
                            >

                                <div className="flex items-center gap-2 mb-1">

                                {comment.userId?.profilePic ?(
                                    <img
                                    src={comment.userId?.profilePic}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full object-cover border"
                                    />
                                ):(
                                    <div className="w-12 h-12 rounded-full
                        bg-gray-300 flex items-center justify-center"
                                    >👤</div>
                                )}
                                

                                    <p className="font-semibold">
                                        {comment.userId?.name || "user"}
                                    </p>
                                </div>

                                <p>{comment.text}</p>
                                </div>
                        ))

                    )
                }
                </div>
            </div>
        </div>
    );
}
export default PostDetail;