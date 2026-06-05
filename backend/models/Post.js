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

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  likes: {
    type: Number,
    default: 0,
  },

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