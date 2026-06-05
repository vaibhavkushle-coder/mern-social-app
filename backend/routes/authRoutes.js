const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

router.post("/register",async(req,res)=>{

    try{

    const data = req.body;

    const existingUser = await User.findOne({

        email:data.email

    });

    if(existingUser){

        return res.status(404).json({
            message:"User already existing"
        });
    }

    const hashedPassword = await bcrypt.hash(
        data.password,10
    );

    const newUser = new User({

        email:data.email,

        password:hashedPassword

    });

    await newUser.save();

    res.status(200).json({
        message:"registered successfully"
    });

}catch(error){

    console.log(error);

    res.status(500).json({
        message:"Something went wrong"
    });
}

});


router.post("/login",async(req,res)=>{

    try{

    const data = req.body;

    const user = await User.findOne({

        email:data.email

    });

    if(!user){

        return res.status(401).json({
            message:"User not found"
        });
    }

const isMatch = await bcrypt.compare(
    data.password,
    user.password
);

if(!isMatch){

    return res.status(401).json({
        message:"Incorrect password"
    })
}

const token = jwt.sign(

    {
        id:user._id,
        email:user.email
    },

    process.env.JWT_SECRET,

    {
        expiresIn:"1d"
    }
);


    res.status(200).json({
        message:"Login successful",
        token:token
    });

}catch(error){

    console.log(error);

    res.status(500).json({
        message:"Something went wrong"
    });

}

});

module.exports = router;