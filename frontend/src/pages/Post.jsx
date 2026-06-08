import { useState, useEffect} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Input from "../components/input";

function Post(){
    const [posts,setPosts] = useState([]);
    const [editingId,setEditingId] = useState(null);
    const [editTitle,setEditTitle] = useState("");
    const [editContent,setEditContent] = useState("");
    const navigate = useNavigate();
    const [comment,setComment] = useState("");
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");

    useEffect(()=>{
        getPosts();
    },[]);

    async function getPosts(){

        const token = localStorage.getItem("token");

        const response = await axios.get(
            
            "https://mern-social-app-xdit.onrender.com/posts",
            {
                headers:{
                    Authorization:token
                }
            }
         );

         setPosts(response.data);
    }

    async function handleDelete(id){

        const confirmation = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if(!confirmation){
            return;
        }
        
        const token = localStorage.getItem("token");

        setLoading(true);

        const response  = await axios.delete(

            `https://mern-social-app-xdit.onrender.com/post/${id}`,

            {
                headers:{
                    Authorization:token
                }
            }
        );

        alert(response.data.message);
        setLoading(false);
        getPosts();
    }

    async function handleUpdate(id){

        const token = localStorage.getItem("token");

        setLoading(true);

        const response = await axios.put(

            `https://mern-social-app-xdit.onrender.com/post/${id}`,

            {
                title:editTitle,
                content:editContent
            },

            {
                headers:{
                    Authorization:token
                }
            }
             
        );

        alert(response.data.message);
        setLoading(false);
        setEditingId(null);
        getPosts();

    }

    function navigateToCreate(){
        navigate("/create-post");
    }

   async function handleLike(id){

    await axios.put(

        `https://mern-social-app-xdit.onrender.com/post/like/${id}`
    );

    getPosts();
   }

   async function handleComment(id){
     
    const token = localStorage.getItem("token");

    await axios.post(
        `https://mern-social-app-xdit.onrender.com/post/comment/${id}`,

        {
            text:comment
        },
        {
            headers:{
                Authorization:token
            }
        }
    );
    getPosts();
    setComment("");
   }

   const filteredPosts = posts.filter((post)=>

post.title.toLowerCase().includes(search.toLocaleLowerCase()) ||

post.content.toLowerCase().includes(search.toLocaleLowerCase())
);
    
    return(
        <div className="p-10 min-h-screen w-full max-w-2xl mx-auto">

           <div className="bg-white p-4 rounded-xl shadow-lg 
           mb-6 flex  flex-col md:flex-row gap-4 items-center">

            <button className="bg-green-500 text-white px-4 py-2
            rounded-lg hover:bg-green-600 transition 
            font-semibold whitespace-nowrap"
            onClick={navigateToCreate}>
               ➕ Create New Post
            </button>

            <Input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />

            </div>

             {
                filteredPosts.length === 0 && search && (
                    <h2 className="text-center text-gray-500 mt-5">
                        No matching posts found 😔
                    </h2>
                )
            }

            {
                posts.length === 0 ? (

                    <div>

                    <h1 className="text-3xl font-bold text-gray-500 text-center mt-20">
                        No posts yet 🚀
                    </h1>

                    <button className="bg-blue-500 text-white p-3 rounded-lg mt-10
                    text-center w-full hover:bg-blue-600 transition"
                    onClick={navigateToCreate}
                    >
                        Create your first post!
                    </button>

                    </div>
                    
                ):(
            
            
                filteredPosts.map((post)=>(
                    <div  className="bg-white p-8 rounded-xl
                     shadow-lg mb-6 hover:shadow-2xl transition
                      w-full max-w-md mx-auto hover:translate-y-1"
                    key={post._id}>


                        <div className="flex items-center gap-3 mb-3">


                            <img
                            src={post.userId?.profilePic}
                            alt="profile"
                            className="w-10 h-10 rounded-full 
                            object-cover border"
                            />

                            <p className="font-semibold text-gray-700">
                                {post.userId.email}
                            </p>

                            </div>

                        
                            {
                                editingId === post._id ? (
                                    <Input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e)=>setEditTitle(e.target.value)}
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold mb-4"
                                    >Title: {post.title}</h2>
                                )
                            }
                                                
                            {
                                editingId === post._id ? (
                                    <Input
                                        type="text"
                                        value={editContent}
                                        onChange={(e)=>setEditContent(e.target.value)}
                                    />
                                ) : (

                                    <div>

                                    <p className="mt-2 text-gray-600 text-lg font-semibold ">
                                        Content: {post.content}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Created By: {post.userId.email}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                       🗓️ {new Date(post.createdAt).toLocaleString()}
                                    </p>

                                    <button className="bg-pink-100 px-3 py-1 rounded-lg 
                                    mt-2 hover:scale-105 transition mb-1"
                                     onClick={()=>handleLike(post._id)}>
                                        ❤️ Like ({post.likes})
                                    </button>

                                    <Input 
                                    value={comment}
                                    onChange={(e)=>setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    />

                                    {
                                        comment.trim() !== "" && (
                                            <button className="bg-green-500 text-white
                                            p-2 rounded-lg ml-2 mt-2 hover:bg-green-700
                                            transition"
                                            onClick={()=>handleComment(post._id)}
                                            >
                                                Comment
                                            </button>
                                        )
                                    }

                                    {
                                        post.comments?.map((comment,index)=>(

                                            <div
                                            key={index}
                                            className="bg-gray-100 p-2 rounded-lg mt-2">
                                               💬 {comment.text}
                                            </div>
                                        ))
                                    }
                                    

                                    </div>
                                    
                                )
                            }

                         <div className="flex gap-2 mt-4">

                          {editingId !== post._id && (

                            <button 
                            className="bg-blue-500 text-white p-3 rounded-lg mt-4 
                            text-center hover:scale-105 w-full transition-all 
                            font-semibold cursor-pointer"
                            onClick={()=>{
                                setEditingId(post._id);
                                setEditTitle(post.title);
                                setEditContent(post.content);
                            }}
                            >
                               ✏️ Edit
                            </button>
                        )}


                            {editingId === post._id && (
                                <button
                                onClick={()=>handleUpdate(post._id)}
                                className="bg-green-500 text-white p-3 rounded-lg mt-4
                                text-center hover:scale-105 w-full transition-all
                                font-semibold cursor-pointer"
                                >
                                    {loading?"Loading...":"✔️ save"}
                                </button>
                                
                            )}

                             <button className="bg-red-500 text-white p-3 rounded-lg
                            mt-4 text-center hover:scale-105 transition-all w-full
                            font-semibold cursor-pointer"
                            onClick={()=>handleDelete(post._id)}>
                                {loading?"Loading...":"🗑️ Delete"}
                            </button>

                            </div>

                            </div>

                         ))
            

          )}

        </div>
    );
}

export default Post;