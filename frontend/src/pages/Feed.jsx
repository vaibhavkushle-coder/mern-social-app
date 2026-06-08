import { useEffect, useState } from "react";
import axios from "axios";

function Feed(){

    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        getFeed();
    },[]);

    async function getFeed(){

        const response = await axios.get(

            "https://mern-social-app-xdit.onrender.com/feed"
        );
        setPosts(response.data);
    }

    return(
        <div className="min-h-screen bg-gray-100 p-5">

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

                        <h2 className="text-2xl font-bold mb-2"
                        >{post.title}</h2>

                        <p className="text-gray-600"
                        >{post.content}</p>
                        
                        </div>
                ))
            }
        </div>
    );
}

export default Feed;