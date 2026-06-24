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
        <div className="min-h-screen 
        bg-gray-100 p-5 pb-24">

            <div className="bg-white p-6 
            rounded-xl shadow-lg max-w-2xl mx-auto mb-6 ">

                <div className="flex items-center gap-4 mb-4">
                    {
                        user?.profilePic ? (
                           <img
                           src={user.profilePic}
                           alt="profile"
                           className="w-20 h-20 rounded-full object-cover border-4 
                           border-blue-500"
                           />

                        ) : (
                            <div className="w-20 h-20 rounded-full
                            bg-gray-300 flex items-center justify-center text-3xl"
                            >👤</div>
                        )
                    }

                    <div>

                        <h1 className="text-2xl font-bold"
                        >{user?.name}</h1>

                        <p className="text-gray-500"
                        >{user?.email}</p>

                    </div>
                </div>

                <div className="flex gap-6 mt-4 text-lg font-semibold">
                    
                    <p>👥 Followers: {user?.followers?.length || 0}</p>
                    <p>➡️ Following: {user?.following?.length || 0}</p>

                </div>
            </div>

            <div className="max-w-2xl mx-auto">

                <h2 className="text-2xl font-bold mb-4"
                >📄 Posts</h2>

                {
                    posts.length === 0 ? (
                        <div className="bg-white p-5 rounded-xl shadow
                        text-center text-gray-500 ">
                            No posts yet 😔
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                            key={post._id}
                            className="bg-white p-5 rounded-xl shadow-lg
                            mb-5"
                            >
                                <p className="text-sm text-gray-500 mb-2"
                                >🗓️ {new Date(post.createdAt).toLocaleDateString()}</p>

                                <h2 className="text-xl font-bold mb-2"
                                >{post.title}</h2>

                                <p className="text-gray-700 mb-3"
                                >{post.content}</p>

                                <div className="flex gap-4 text-sm text-gray-600">

                                    <p >❤️ {post.likes}</p>
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