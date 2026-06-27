const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default:"",
  },


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
],

  comments: [
    {
      text:String,
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
      }
    }
  ],
  

},{
  timestamps:true
});

module.exports = mongoose.model("Post", postSchema);