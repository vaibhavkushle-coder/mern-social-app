const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const bcrypt = require("bcryptjs");

const cloudinary = require("cloudinary").v2;



dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");
const Post = require("./models/Post");
const upload = require("./middleware/upload");


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


app.post("/post",authMiddleware,async(req,res)=>{

    const { title, content } = req.body;

    const newPost = new Post({

        title,
        content,
        userId:req.user.id

    });

    await newPost.save();

    res.json({
        message:"Post created successfully"
    });

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
        (sum,post) =>sum + post.likes,
        0
    );

    const totalComments = posts.reduce(
        (sum,post) => sum + post.comments.length,
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
    .sort({ createdAt: -1 });

    res.json(posts);

});

app.delete("/post/:id",authMiddleware,async(req,res)=>{

    await Post.findByIdAndDelete(req.params.id);

    res.json({
        message:"Post deleted successfully"
    });

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

app.put("/post/like/:id",async(req,res)=>{

    const post = await Post.findById(req.params.id);

    post.likes += 1;

    await post.save();

    res.json({
        message:"Post liked"
    });

});

app.post("/post/comment/:id",authMiddleware,async(req,res)=>{

    const post = await Post.findById(req.params.id);

    post.comments.push({
        text:req.body.text,
        userId:req.user.id
    });

    await post.save();

    res.json({
        message:"Comment added"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

    console.log(`Server running on ${PORT}`)

});