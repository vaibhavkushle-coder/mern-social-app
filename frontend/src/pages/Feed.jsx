import { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [following, setFollowing] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const [commentInputs, setCommentInputs] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        getFeed();
        getProfile();
        getSuggestedUsers();
    }, []);

    async function getFeed() {
        try {
            setLoading(true);

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/feed"
            );

            setPosts(response.data);
        } catch (error) {
            console.log("FEED ERROR =>", error);
        } finally {
            setLoading(false);
        }
    }

    async function getProfile() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/profile",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setFollowing(response.data.user.following || []);
            setCurrentUserId(response.data.user._id);
        } catch (error) {
            console.log("PROFILE ERROR =>", error);
        }
    }

    async function getSuggestedUsers() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/suggested-users",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setSuggestedUsers(response.data);
        } catch (error) {
            console.log("SUGGESTED USERS ERROR =>", error);
        }
    }

    async function handleLike(id) {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `https://mern-social-app-xdit.onrender.com/post/like/${id}`,
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

           await getFeed();
        } catch (error) {
            console.log("LIKE FRONTEND ERROR =>", error);
            toast.alert(error?.response?.data?.message || "Error liking post");
        }
    }

    async function handleComment(postId) {
        try {
            const token = localStorage.getItem("token");
            const text = commentInputs[postId]?.trim();

            if (!text) return;

            await axios.post(
                `https://mern-social-app-xdit.onrender.com/post/comment/${postId}`,
                { text },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setCommentInputs((prev) => ({
                ...prev,
                [postId]: ""
            }));

            getFeed();
        } catch (error) {
            console.log("COMMENT ERROR =>", error);
            toast.alert(error?.response?.data?.message || "Error adding comment");
        }
    }

    async function handleDeleteComment(postId,commentId){
        try{
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `https://mern-social-app-xdit.onrender.com/post/comment/${postId}/${commentId}`,
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            toast.success(response.data.message);

            getFeed();
        }catch(error){
            console.log("DELETE COMMENT ERROR =>",error);
            toast.alert(error?.response?.data?.message || "Error deleting comment");
        }
    }

    async function handleFollow(userId) {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                `https://mern-social-app-xdit.onrender.com/follow/${userId}`,
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success(response.data.message);

            await getProfile();
            await getSuggestedUsers();
            await getFeed();
        } catch (error) {
            console.log("FOLLOW ERROR =>", error);
            toast.alert(error?.response?.data?.message || "Error following user");
        }
    }

    async function handleUnfollow(userId) {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                `https://mern-social-app-xdit.onrender.com/unfollow/${userId}`,
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success(response.data.message);

            await getProfile();
            await getSuggestedUsers();
            await getFeed();
        } catch (error) {
            console.log("UNFOLLOW ERROR =>", error);
            toast.alert(error?.response?.data?.message || "Error unfollowing user");
        }
    }

    const filteredPosts = posts.filter((post) =>
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.content?.toLowerCase().includes(search.toLowerCase()) ||
        post.userId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-5 pb-24">
            <h1 className="text-center font-bold text-2xl mb-5">🌏 Public Feed</h1>

            {suggestedUsers.length > 0 && (

                <div className="bg-white rounded-xl shadow-lg
                 p-4 mb-5 max-w-xl mx-auto">

                    <h2 className="text-lg font-bold mb-3">People to Follow</h2>

                    
              <div className="flex gap-4 overflow-x-auto pb-2">
                    {suggestedUsers.map((user) => (
                        <div
                            key={user._id}
                            className=" min-w-[220px] bg-gray-100 rounded-lg  p-3
                            flex  flex-col gap-2"
                        >
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                               onClick={(e)=>{
                                e.stopPropagation();
                                navigate(`/user/${user._id}`);
                               }}
                            >
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt="profile"
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                                        👤
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-black"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollow(user._id);
                                }}
                            >
                                ➕ Follow
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            
            <Input
                type="text"
                placeholder="🔍 Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

        
            {loading && (
                <div className="text-center mt-10">
                    ⌛ Loading Feed...
                </div>
            )}

        
            {!loading && filteredPosts.length === 0 && (
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-bold text-gray-500">
                        NO posts found 😔
                    </h2>
                </div>
            )}


            {!loading &&
                filteredPosts.map((post) => {
                    // FIXED FOLLOW CHECK
                    const isFollowing = following.some(
                        (user) =>
                            user._id?.toString() === post.userId?._id?.toString()
                    );

                    const isLiked = post.likes?.some(
                        (id) => id.toString() === currentUserId
                    );

                    return (
                        <div
                            key={post._id}
                            onClick={()=>navigate(`/post/${post._id}`)}

                            className="bg-white p-5 rounded-xl 
                            shadow-lg mb-5 max-w-xl mx-auto 
                            hover:shadow-2xl transition cursor-pointer"
                        >
            
                            <div
                                className="flex items-center gap-3 mb-3 cursor-pointer"
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    navigate(`/user/${post.userId?._id}`);
                                }}
                            >
                                <img
                                    src={post.userId?.profilePic}
                                    alt="profile"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                />

                                <p className="font-semibold text-gray-700">
                                    {post.userId?.name}
                                </p>

                                {post.userId?._id !== currentUserId && (
                                    <button
                                        className={`ml-auto px-3 py-1 rounded-lg text-sm text-white ${
                                            isFollowing ? "bg-green-500" : "bg-blue-500"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            isFollowing
                                                ? handleUnfollow(post.userId._id)
                                                : handleFollow(post.userId._id);
                                        }}
                                    >
                                        {isFollowing ? "✅ Following" : "➕ Follow"}
                                    </button>
                                )}
                            </div>

                            <p className="text-sm text-gray-500">
                                🗓️ {new Date(post.createdAt).toLocaleString()}
                            </p>

                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-600">{post.content}</p>

                             {post.image && (
                                            <img
                                            src={post.image}
                                            alt="post"
                                            className="w-full rounded-lg mt-3
                                            object-cover max-h-96"
                                            />
                                        )}

                            
                            <div className="flex gap-4 mt-2 items-center">
                                <button
                                    className={`px-3 py-1 rounded-lg mt-2 mb-1 ${
                                        isLiked
                                            ? "bg-red-300 text-black"
                                            : "bg-pink-100 text-black"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                         handleLike(post._id);
                                    }}
                                >
                                    {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
                                </button>

                                <p className="text-sm text-gray-500 mt-2
                                cursor-pointer hover:underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/post/${post._id}`);
                                }}>
                                    💬 {post.comments?.length || 0} comments
                                </p>
                            </div>

                             <div onClick={(e) => e.stopPropagation()}>
                            <Input
                                value={commentInputs[post._id] || ""}
                                onChange={(e) =>
                                    setCommentInputs((prev) => ({
                                        ...prev,
                                        [post._id]: e.target.value
                                    }))
                                }
                                onKeyDown={(e)=>{
                                    if(e.key === "Enter"){

                                        e.preventDefault();
                                        handleComment(post._id);
                                    }
                                }}
                                placeholder="Write a comment..."
                            />
                            </div>

                            {(commentInputs[post._id] || "").trim() !== "" && (
                                <button
                                    className="bg-green-500 text-white p-2 rounded-lg mt-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                         handleComment(post._id);
                                    }}
                                >
                                    💬 Comment
                                </button>
                            )}

                
                            {post.comments?.slice(-2).map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 p-2 rounded-lg mt-2"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {comment.userId?.profilePic ? (
                                            <img 
                                            src={comment.userId.profilePic}
                                            alt="profile"
                                            className="w-8 h-8 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300
                                            flex items-center justify-center">
                                                👤
                                                </div>
                                        )
                                    }
                                    <b>{comment.userId.name}</b>
                                </div>
                                <div className="flex justify-between items-center"
                                onClick={(e)=> e.stopPropagation()}>

                                    <p>{comment.text}</p>

                                    {comment.userId?._id === currentUserId && (
                                        <button
                                        className="text-red-500 p-1 rounded-lg
                                        bg-red-400 cursor-pointer
                                        hover:bg-red-700"
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handleDeleteComment(post._id,comment._id);
                                        }}>
                                            🗑️
                                        </button>

                                        )}
                                        
                                    </div>
                                   
                                </div>
                            ))}
                             {post.comments?.length > 2 && (
                                            <button
                                            className="text-blue-500 text-sm 
                                            mt-2 hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/post/${post._id}`);
                                            }}
                                            >
                                            View all comments...
                                            </button>
                                        )}

                                       
                        </div>
                    );
                })}
        </div>
    );
}

export default Feed;