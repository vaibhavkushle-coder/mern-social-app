const express = require("express");

const http = require("http");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const bcrypt = require("bcryptjs");

const cloudinary = require("cloudinary").v2;

const { Server } = require("socket.io");






dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

const onlineUsers={};

io.on("connection",(socket) => {

    console.log("🟢 User Connected:",socket.id);

    socket.on("join",(userId)=>{

        onlineUsers[userId]=socket.id;
        
        io.emit("onlineUsers",onlineUsers);

        socket.join(userId);

        console.log(userId,"joined");
    });

    socket.on("typing",(data)=>{

        const receiverSocket=
        onlineUsers[data.receiverId];

        io.to(receiverSocket).emit("typing",{
            senderId:data.senderId
        });
    });

        socket.on("stopTyping",(data)=>{
           
            const receiverSocket =
            onlineUsers[data.receiverId];

            if(receiverSocket){
                io.to(receiverSocket).emit("stopTyping");
            }
        });
        

        socket.on("messageSeen",async(data)=>{

            const message = await
            Message.findByIdAndUpdate(
                data.messageId,
                {seen:true},
                {new:true}
            );

            const senderSocket =
            onlineUsers[message.sender.toString()];

            if(senderSocket){

                io.to(senderSocket).emit("messageSeen",{
                    messageId:message._id
                });
            }

        });


    socket.on("disconnect",() => {

        const userId = 
        Object.keys(onlineUsers).find(
            key=>onlineUsers[key]===socket.id
        );

        if(userId){
            delete onlineUsers[userId];
            io.emit("onlineUsers",onlineUsers);
        }
        
        console.log("🔴 User Disconnected:",socket.id);
    });
});



const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");
const Post = require("./models/Post");
const upload = require("./middleware/upload");
const Notification = require("./models/Notification");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");



app.use(cors());

connectDB();

app.use(express.json());

app.use("/api/auth/",authRoutes);

app.get("/",(req,res)=>{

    res.status(201).json({
        message:"serven running"
    });

});

app.get("/profile", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.id)
    .populate("followers","name email profilePic")
    .populate("following","name email profilePic");

    res.json({
        message: "Profile data",
        user
    });
});

app.put("/profile",authMiddleware,async(req,res)=>{

    const { email, name } = req.body;

    const user = await User.findByIdAndUpdate(

        req.user.id,

        {
            email,
            name
        },

        {new:true}

    );

    res.json({
        message:"Profile updated successfully",

        user
    });
});

app.put(
    "/profile-photo",
    authMiddleware,
    upload.single("image"),
    async(req,res)=>{

        try{

        const result = await
        cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                profilePic: result.secure_url
            },
            {
                new:true
            }
        );

        res.json({
            message:"Profile photo updated",
            profilepic: user.profilePic
        });

    }catch(error){

        console.log("ERROR =>",error);

        res.status(500).json({
            error:error.message
        });

    }
    
    }
);

app.put("/change-password",authMiddleware,async(req,res)=>{

    const { oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
    );

    if(!isMatch){

        return res.status(400).json({
            message:"Old password is incorrect"
        });

    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    user.password = hashedPassword;

    await user.save();

    res.json({
        message:"Password changed successfully"
    });

});


app.put("/follow/:id",authMiddleware,
    async(req,res)=>{

        try{

        
        if(req.user.id === req.params.id){
            return res.status(400).json({
                message:"You cannot follow yourself"
            });
        }

        const userToFollow = await
        User.findById(req.params.id);

        const currentUser = await
        User.findById(req.user.id);

        if(!userToFollow){
            return res.status(404).json({
                message:"User not found"
            });
        }

        const alreadyFollowing = 
        currentUser.following.some(
            (id) => id.toString() === userToFollow._id.toString()
        );

        if(alreadyFollowing) {
            return res.status(400).json({
                message:"Already following"
            });
        }


        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        await Notification.create({
    receiver: userToFollow._id,
    sender: currentUser._id,
    type: "follow"
});

      

        res.json({
            message: "User followed successfully"
        });

    }catch(error) {
        console.log("FOLLOW ERROR =>" , error);
        res.status(500).json({
            message:"Error following user"
        });
    }
    }
);

app.get("/suggested-users",authMiddleware,
    async(req,res)=>{
        try{
            const currentUser = await
            User.findById(req.user.id);

            const suggestedUsers = await
            User.find({
                _id: {
                    $ne: req.user.id,
                    $nin: currentUser.following
                }
            })

            .select("name email profilePic");

            res.json(suggestedUsers);

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message:"Error fetching suggested users"
            });
        }
    }
);

app.get("/user/:id",authMiddleware,async(req,res)=>{

    try{

        const user = await
        User.findById(req.params.id)
        .populate("followers","name email profilePic")
        .populate("following","name email profilePic");

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        const posts = await
        Post.find({ userId: req.params.id})
        .populate("userId","name email profilePic")
        .populate("comments.userId","name profilePic")
        .sort({ createdAt: -1 });

        res.json({
            user,
            posts
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error fetching user profile"
        });
    }
});

app.get("/post/:id",authMiddleware,async(req,res)=>{

    try{

        const post = await
        Post.findById(req.params.id)
               .populate("userId","name email profilePic")
               .populate("comments.userId","name profilePic");

               if (!post){
                return res.status(404).json({
                    message:"Post not found"
                });
               }

               res.json(post);

    } catch(error){
        console.log("GET SINGLE POST ERROR =>",error);
        res.status(500).json({
            message:"Error fetching post"
        });
    }
});

app.put("/unfollow/:id",authMiddleware,
    async(req,res)=>{

        try{

        const userToUnfollow = await 
        User.findById(req.params.id);

        const currentUser = await
        User.findById(req.user.id);
    

      const isFollowing =
      currentUser.following.some(
        (id) => id.toString() === userToUnfollow._id.toString()
      );

      if (!isFollowing){
        return res.status(400).json({
            message:"You are not following this user"
        })
      }
    currentUser.following = 
    currentUser.following.filter(
        (id) => id.toString() !==
        userToUnfollow._id.toString()
    );

    userToUnfollow.followers =
    userToUnfollow.followers.filter(
        (id) => id.toString() !==
        currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
        message:"User unfollowed successfully"
    });

} catch (error) {
    console.log("UNFOLLOW ERROR =>" , error);
    res.status(500).json({
        message:"Error unfollowing user"
    });
}

}
);


app.post("/post",authMiddleware,
    upload.single("image"),async(req,res)=>{

    const { title, content } = req.body;

   let imageUrl = "";

   if (req.file)  {
   const result = await cloudinary.uploader.upload(
  `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
);
    imageUrl = result.secure_url;
   }

    const newPost = new Post({

        title,
        content,
        image: imageUrl,
        userId:req.user.id

    });

    await newPost.save();

    res.json({
        message:"Post created successfully"
    });

});

app.post("/conversation/:userId",authMiddleware,async(req,res)=>{

    try{

        let conversation = await
        Conversation.findOne({
            participants:{
                $all:[req.user.id,req.params.userId]
            }
        });

        if(! conversation){

            conversation = await 
            Conversation.create({
                participants:[req.user.id,req.params.userId]
            });
        }

        res.json(conversation);

    }catch(error){
        console.log("CONVERSATION ERROR =>",error);
        res.status(500).json({
            message:"Error creating conversation"
        });
    }
});

app.post(
    "/message",
    authMiddleware,
    upload.single("image"),
    async(req,res)=>{

    try{

        const { conversationId, text }= req.body;

        let imageUrl = "";

        if(req.file){

           const result = await cloudinary.uploader.upload(
  `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
);

            imageUrl = result.secure_url;
        }

        if(!text.trim() && !req.file){
            return res.status(400).json({
                message:"Message or image is required"
            });
        }

        const message = await Message.create({

            conversation: conversationId,
            sender: req.user.id,
            text,
            image: imageUrl

        });

        const populatedMessage = await
        Message.findById(message._id)
        .populate("sender","name profilePic");

        const conversation = await
        Conversation.findById(conversationId);

        const receiverId =
        conversation.participants.find(
            (id) => id.toString()!==req.user.id
        );

        io.to(receiverId.toString()).emit("newMessage",populatedMessage);

        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage:text,
                lastMessageTime:new Date(),
                updatedAt:new Date()
            },
            {
                new:true
            }
        );

       const receiverUnreadCount = await
       Message.countDocuments({
        conversation:conversationId,
        sender:req.user.id,
        seen:false,
       });

       const senderUnreadCount = 0;

       const receiverConversation = await
       Conversation.findById(conversationId)
       .populate("participants","name profilePic");

       receiverConversation._doc.unreadCount = receiverUnreadCount;

       const senderConversation = await
       Conversation.findById(conversationId)
       .populate("participants","name profilePic");

       senderConversation._doc.unreadCount = senderUnreadCount;

       io.to(receiverId.toString()).emit("conversationUpdate",receiverConversation);

       io.to(req.user.id).emit("conversationUpdate",senderConversation);

        res.json(populatedMessage);

    } catch (error){
        console.log("MESSAGE ERROR =>",error);
        res.status(500).json({
            message:"Error sending message"
        });
    }
});

app.get("/message/:conversationId",authMiddleware,async(req,res)=>{

    try{

        const messages = await Message.find({
            conversation: req.params.conversationId
        })
        .populate("sender","name profilePic")
        .sort({ createdAt: 1});

        res.json(messages);

    }catch(error){
        console.log("GET MESSAGES ERROR =>",error);
        res.status(500).json({
            message:"Error fetching messages"
        });
    }
});

app.get("/conversations",authMiddleware,async(req,res)=>{

    try{

        const conversations = await Conversation.find({
            participants: req.user.id
        })
        .populate("participants","name profilePic")
        .sort({ updatedAt: -1});

        const conversationsWithUnread = await 
        Promise.all(

            conversations.map(async(conversation)=>{

                const unreadCount = await Message.countDocuments({

                    conversation: conversation._id,

                    sender:{ $ne:req.user.id},

                    seen:false
                });

                return {
                    ...conversation.toObject(),
                    unreadCount
                };
            })
        );

        res.json(conversationsWithUnread);

    }catch(error){
        console.log("GET CONVERSATION ERROR =>",error);
        res.status(500).json({
            message:"Error fetching conversations"
        });
    }
});

app.get("/posts",authMiddleware,async(req,res)=>{
    const posts = await Post.find({

        userId:req.user.id
    }).populate("userId","name email profilePic");

    res.json(posts);
});

app.get("/dashboard",authMiddleware,async(req,res)=>{

    const posts = await Post.find({
        userId: req.user.id
    });

    const totalPosts = posts.length;

    const totalLikes = posts.reduce(
        (sum,post) =>sum + (post.likes?.length || 0),
        0
    );

    const totalComments = posts.reduce(
        (sum,post) => sum + (post.comments?.length || 0),
        0
    );

    res.json({
        totalPosts,
        totalLikes,
        totalComments
    });
});

app.get("/feed",async(req,res)=>{

    const posts = await Post.find()
    .populate("userId","name email profilePic")
    .populate("comments.userId","name profilePic")
    .sort({ createdAt: -1 });

    res.json(posts);

});

app.delete("/post/:id",authMiddleware,async(req,res)=>{

    await Post.findByIdAndDelete(req.params.id);

    res.json({
        message:"Post deleted successfully"
    });

});

app.delete("/post/comment/:postId/:commentId",authMiddleware,
    async(req,res)=>{

        try{

            const post = await
            Post.findById(req.params.postId);

            if (!post){
                return res.status(404).json({
                    message:"Post not found"
                });
            }

            const comment = 
            post.comments.id(req.params.commentId);

            if(! comment) {
                return res.status(404).json({
                    message:"Comment not found"
                });
            }

            if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message:"YOu can delete only your own comment"
            });
            }

            post.comments.pull(comment._id);

            await post.save();

            res.json({
                message:"Comment deleted successfully"
            });

        }catch(error){
            console.log("DELETE COMMENT ERROR =>",error);
            res.status(500).json({
                message:"Server Error"
            });
        }
    });

app.put("/post/:id",authMiddleware,async(req,res)=>{

    const { title, content} = req.body;

    const post = await Post.findByIdAndUpdate(

        req.params.id,

        {
            title,
            content
        },

        {
            new:true
        }
        
    );

    res.json({
        message:"Post updated successfully",
        post
    });

});

app.put("/post/like/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        const alreadyLiked = post.likes.some(
            (id) => id.toString() === req.user.id
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== req.user.id
            );

            await post.save();

            return res.json({
                message: "Post unliked"
            });
        }

        post.likes.push(req.user.id);
        await post.save();

        if (post.userId.toString() !== req.user.id) {
    await Notification.create({
        receiver: post.userId,
        sender: req.user.id,
        type: "like",
        postId: post._id,
    });
}

      

        res.json({
            message: "Post liked"
        });

    } catch (error) {
        console.log("LIKE ERROR =>", error);
        res.status(500).json({
            message: "Error liking post",
            error: error.message
        });
    }
});

app.post("/post/comment/:id",authMiddleware,async(req,res)=>{

    const post = await Post.findById(req.params.id);

    post.comments.push({
        text:req.body.text,
        userId:req.user.id
    });

    await post.save();

    if (post.userId.toString() !== req.user.id) {
    await Notification.create({
        receiver: post.userId,
        sender: req.user.id,
        type: "comment",
        postId: post._id,
    });
}

   
    res.json({
        message:"Comment added"
    });
});

app.get("/notifications", authMiddleware, async (req, res) => {
    try {

        const notifications = await Notification.find({
            receiver: req.user.id
        })
        .populate("sender", "name profilePic")
        .sort({ createdAt: -1 });

        res.json(notifications);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching notifications"
        });

    }
});

app.get("/notifications/count",authMiddleware,async(req,res)=>{

    try{

        const count = await Notification.countDocuments({
            receiver: req.user.id,
            isRead: false
        });

        res.json({
            count
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error fetching notification count"
        });
    }
});


app.put("/notifications/read",authMiddleware,async(req,res)=>{

    try{

        await Notification.updateMany(
            {
                receiver:req.user.id,
                isRead:false
            },
            {
                isRead:true
            }
        );

        res.json({
            message:"All notification marked as read"
     });
    }catch(error){

        console.log("READ NOTIFICATION ERROR =>",error);
        res.status(500).json({
            message:"Error updating notifications"
        });
    }
});



const PORT = process.env.PORT || 5000;

server.listen(PORT,() => {
    console.log(`Server running on ${PORT}`);
});