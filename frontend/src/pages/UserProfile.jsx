import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/input";
import toast from "react-hot-toast";

function UserProfile(){
    const navigate = useNavigate();

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId,setCurrentUserId]=useState("");
    const [isFollowing,setIsFollowing]=useState(false);
    const [commentInputs,setCommentInputs]=useState({});

    useEffect(()=>{
        getUserProfile();
        getCurrentUser();

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

     async function getCurrentUser() {
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

            const currentUser = response.data.user;

            setCurrentUserId(currentUser._id);

            const alreadyFollowing = 
            currentUser.following?.some(
                (followedUser) =>
                    followedUser._id?.toString() === id
            );

            setIsFollowing(alreadyFollowing);

        } catch(error){
            console.log("CURRENT USER ERROR =>",error);
        }
    }

      async function handleFollow() {

        try{

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `https://mern-social-app-xdit.onrender.com/follow/${id}`,
                {},
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            toast.success(response.data.message);

            setIsFollowing(true);
            getUserProfile();

        } catch(error){
            console.log("FOLLOW ERROR =>",error);
            toast.alert(error?.response?.data?.message || "Error following user");
        }

    }

     async function handleUnfollow(){

        try{
            
            const token = localStorage.getItem("token");

            const response = await axios.put(
                `https://mern-social-app-xdit.onrender.com/unfollow/${id}`,
                {},
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            toast.success(response.data.message);

            setIsFollowing(false);
            getUserProfile();

        } catch(error){
            console.log("UNFOLLOW ERROR =>",error);
            toast.alert(error?.response?.data?.message || "Error unfollowing user");
        }
    }

    async function handleLike(postId){

        try{
            const token = localStorage.getItem("token");

            await axios.put(
                `https://mern-social-app-xdit.onrender.com/post/like/${postId}`,
                {},
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            getUserProfile();
        } catch(error) {
            console.log("USER PROFILE LIKE ERROR =>",error);
            toast.alert(error?.response?.data?.message || "Enter liking post");
        }
    }

    async function handleComment(postId) {
        try{

            const token = localStorage.getItem("token");

            const text = commentInputs[postId]?.trim();

            if(!text) return;

            await axios.post(
                `https://mern-social-app-xdit.onrender.com/post/comment/${postId}`,
                { text },
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setCommentInputs((prev) => ({
                ...prev,
                [postId]: ""
            }));

            getUserProfile();

        } catch(error){
            console.log("USER PROFILE COMMENT ERROR =>",error);
            toast.alert(error?.response.data?.message || "Error adding comment");
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

                        <p className="text-gray-500"> 
                            {user?.email}</p>

                        {user?._id !== currentUserId && (

                          <div className="flex gap-2 mt-3">

                            <button
                            className={`px-4 py-2
                                rounded-lg text-white 
                                ${
                                    isFollowing ?
                                    "bg-green-500" : "bg-blue-500"
                                }`}
                                onClick={isFollowing ?
                                    handleUnfollow : handleFollow
                                }>
                                    {isFollowing ? "✅ Following" : "➕ Follow"}
                                </button>

                                <button
                                className="px-4 py-2 rounded-lg bg-purple-500
                                 text-white "
                                onClick={()=>navigate(`/chat/${user._id}`)}
                                >
                                   💬 Message
                                </button>

                             </div>
                        )}

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
                        posts.map((post) =>{
                            const isLiked = post.likes?.some(
                                (likeUserId) =>
                                    likeUserId.toString() === currentUserId
                            );
return (
    <div
        key={post._id}
        className="bg-white p-5 rounded-xl shadow-lg mb-5"
    >
        <p className="text-sm text-gray-500 mb-2">
            🗓️ {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <h2 className="text-xl font-bold mb-2">{post.title}</h2>

        <p className="text-gray-700 mb-3">{post.content}</p>

        {/* Like + comment count */}
        <div className="flex gap-4 text-sm text-gray-600 items-center">
            <button
                className={`px-3 py-1 rounded-lg ${
                    isLiked
                        ? "bg-red-300 text-black"
                        : "bg-pink-100 text-black"
                }`}
                onClick={() => handleLike(post._id)}
            >
                {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
            </button>

            <p>🗨️ {post.comments?.length || 0} comments</p>
        </div>

        {/* Comment input */}
        <Input
            value={commentInputs[post._id] || ""}
            onChange={(e) =>
                setCommentInputs((prev) => ({
                    ...prev,
                    [post._id]: e.target.value
                }))
            }
            placeholder="Write a comment..."
        />

        {/* Comment button */}
        {(commentInputs[post._id] || "").trim() !== "" && (
            <button
                className="bg-green-500 text-white p-2 rounded-lg mt-2"
                onClick={() => handleComment(post._id)}
            >
                🗨️ Comment
            </button>
        )}

        {/* Last 2 comments */}
        {post.comments?.slice(-2).map((comment, index) => (
            <div
                key={index}
                className="bg-green-100 p-2 rounded-lg mt-2"
            >
                <p>
                    <b>{comment.userId?.name || "User"}</b>: {comment.text}
                </p>
            </div>
        ))}
    </div>
);})
                    )
                }
            </div>
        </div>
    );

}

export default UserProfile;