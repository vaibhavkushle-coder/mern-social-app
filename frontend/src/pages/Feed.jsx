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
        <div>

            <h1>🌏 Public Feed</h1>

            {
                posts.map((post)=>(
                    <div key={post._id}>

                        <img

                        src={post.userId?.profilePic}
                        alt="profile"
                        width="50"
                        />

                        <h3>{post.userId?.email}</h3>

                        <h2>{post.title}</h2>

                        <p>{post.content}</p>
                        
                        </div>
                ))
            }
        </div>
    );
}

export default Feed;