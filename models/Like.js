const mongoose = require("mongoose");
const likeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

likeSchema.index({postId:1})
const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
