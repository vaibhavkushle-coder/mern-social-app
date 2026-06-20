import { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/input";

function Feed(){

    const [posts,setPosts] = useState([]);
    const [comment,setComment] = useState("");
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(true);
    const [following,setFollwing] = useState([]);

    useEffect(()=>{
        getFeed();
        getProfile();
    },[]);

    async function getFeed(){

        setLoading(true);

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/feed"
        );
        setPosts(response.data);
        setLoading(false);
    }

    async function getProfile(){

        const token = localStorage.getItem("token");

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/profile",
            {
                headers:{
                    Authorization: token
                }
            }
        );
        setFollwing(response.data.user.following);
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

    async function handleFollow(userId){

        const token = localStorage.getItem("token");

        const response = await axios.put(

            `https://mern-social-app-xdit.onrender.com/follow/${userId}`,
            {},
            {
                headers:{
                    Authorization: token
                }
            }
        );

        alert(response.data.message);
        getFeed();
    }

    async function handleUnfollow(userId){

        const token = localStorage.getItem("token");

        const response = await axios.put(

            `https://mern-social-app-xdit.onrender.com/unfollow/${userId}`,
            {},
            {
                headers:{
                    Authorization: token
                }
            }
        );

        alert(response.data.message);
        getFeed();
        getProfile();
    }

     const filteredPosts =
           posts.filter((post)=>
           
           post.title.toLowerCase().includes(search.toLowerCase()) ||
           
           post.content.toLowerCase().includes(search.toLowerCase()) ||
           
           post.userId?.name?.toLowerCase().includes(search.toLowerCase())
           
           );

    return(
        <div className="min-h-screen bg-gray-100 p-5 pb-24">

            <h1 className="text-center font-bold"
            >🌏 Public Feed</h1>

            <Input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />

          {
           ! loading && filteredPosts.length === 0 && (
                <div className="text-center mt-10">

                    <h2 className="text-2xl font-bold text-gray-500"
                    >NO posts found 😔</h2>
                </div>
            )
          }

          {
            loading && (
                <div className="text-center mt-10">
                 ⌛ Loading Feed...
                </div>
            )
          }

            {
                ! loading &&
                filteredPosts.map((post)=>{

                    const isFollowing = 
                    following.includes(post.userId?._id);
                    
                    return(

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

                        <button
                        className={`px-3 py-1 rounded-lg text-sm 
                            text-white ${
                                isFollowing ? "bg-green-500" :
                                "bg-blue-500"
                            }`}
                        onClick={()=>
                            isFollowing
                            ? handleUnfollow(post.userId._id)
                            : handleFollow(post.userId._id)
                        }
                        >
                         {isFollowing ? "✅ Following" : "➕ Follow"}
                        </button>

                        </div>

                         <p className="text-sm text-gray-500">
                                       🗓️ {new Date(post.createdAt).toLocaleString()}
                                    </p>


                        <h2 className="text-2xl font-bold mb-2"
                        >{post.title}</h2>

                        <p className="text-gray-600"
                        >{post.content}</p>

                        <div className="flex gap-4 mt-2">

                        <button
                        className="bg-pink-100 px-3 py-1 
                        rounded-lg mt-2 mb-1
                        hover:scale-105 transition"
                        onClick={()=>handleLike(post._id)}>
                           ❤️{post.likes}
                        </button>

                       
                         <p className="text-sm text-gray-500 mt-2">
                           💬 {post.comments?.length || 0} comments

                        </p>

                        </div>

                        <Input
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        placeholder="Write a comment..."
                        />



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
                )}
            )
            }
        </div>
    );
}

export default Feed;