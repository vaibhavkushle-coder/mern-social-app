import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfile(){

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getUserProfile();
    },[]);


    async function getUserProfile(){

        try{

            const token = localStorage.getItem("token");

            const response = await axios.get(

                `https://mern-social-app-xdit.onrender.com/user/${id}`,
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setUser(response.data.user);
            setPosts(response.data.posts);
            setLoading(false);

        }catch(error){
            console.log(error);
            setLoading(false);
        }
    }

    if (loading) {
        return(
            <div className="text-center mt-20 text-xl font-semibold">
               ⌛ Loading Profile...
            </div>
        );
    }

    return(
        <div>
            <div>
                <div>
                    {
                        user?.profilePic ? (
                           <img
                           src={user.profilePic}
                           alt="profile"
                           />

                        ) : (
                            <div>👤</div>
                        )
                    }

                    <div>
                        <h1>{user?.name}</h1>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <div >
                    <p>👥 Followers: {user?.followers?.length || 0}</p>
                    <p>➡️ Following: {user?.following?.length || 0}</p>

                </div>
            </div>

            <div>
                <h2>📄 Posts</h2>

                {
                    posts.length === 0 ? (
                        <div>
                            No posts yet 😔
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                            key={post._id}
                            >
                                <p>🗓️ {new Date(post.createdAt).toLocaleDateString()}</p>

                                <h2>{post.title}</h2>
                                <p>{post.content}</p>

                                <div>

                                    <p>❤️ {post.likes}</p>
                                    <p>🗨️ {post.comments?.length || 0} comments</p>
                            </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );

}

export default UserProfile;