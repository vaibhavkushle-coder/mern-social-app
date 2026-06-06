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

app.get("/profile",
    authMiddleware,
    (req,res)=>{

        res.status(200).json({
            message:"Profile data",

            user:req.user
        });

    }
)

app.put("/profile",authMiddleware,async(req,res)=>{

    const { email } = req.body;

    const user = await User.findByIdAndUpdate(

        req.user.id,

        {email},

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
    }).populate("userId","email");

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