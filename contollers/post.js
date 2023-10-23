const mongoose = require("mongoose");

const sendError = require("../helper/sendError");
const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Friend = require("../models/Friend");
const Follower = require('../models/Follower')

// const getAllPosts = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const limit = req.query.limit;
//     const page = req.query.page;

//     const friends = await Friend.find({ user1Id: userId }).select("user2Id");
//     friends.push({ user2Id: userId });

//     const id = friends.map(friend => new mongoose.Types.ObjectId(friend.user2Id));

//     let posts = await Post.find({ userId: { $in: id } })
//       .populate({ path: "userId", select: "_id firstName lastName ", alias: "user" })
//       .sort({ createdAt: -1, _id: -1 })
//       .limit(limit)
//       .skip(limit * (page - 1))
//       .lean();

//     posts = await Promise.all(
//       (posts = posts.map(async post => {
//         try {
//           let like = await Like.find({ postId: post._id }).lean();
//           post.like = like;
//           return post;
//         } catch (error) {
//           console.log(error);
//         }
//       }))
//     );

//     posts.map(post => {
//       post.createdBy = post.userId;
//       delete post.userId;
//     });

//     res.json(posts);
//   } catch (error) {
//     console.log(error);
//     sendError(res, 500, error.message);
//   }
// };

const getAllPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = req.query.limit;
    const page = req.query.page;

    const connections = await Follower.find({ followerId:userId}).select("followingId");
    connections.push({ followingId: userId });
    const id = connections.map(connection => new mongoose.Types.ObjectId(connection.followingId));

    let posts = await Post.find({ userId: { $in: id } })
      .populate({ path: "userId", select: "-password -email ", alias: "user" })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    posts = await Promise.all(
      (posts = posts.map(async post => {
        try {
          let like = await Like.find({ postId: post._id }).lean();
          post.like = like;
          return post;
        } catch (error) {
          console.log(error);
        }
      }))
    );

    posts.map(post => {
      post.createdBy = post.userId;
      delete post.userId;
    });

    res.json(posts);
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

const getUsersPosts = async (req, res) => {
  try {
    console.log("GET POSTS");
    const userId = req.userId;
    const { limit, page } = req.query;
    const response = await Post.find({ userId })
      .lean()
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    console.log("CREATNG POST");

    const userId = req.userId;
    const text = req.body?.text;
    const imageUrl = req.imageUrl;

    if (!text && !imageUrl) return res.status(400).json({ message: "Atleast imageUrl or text is required" });

    let post = {};
    if (text?.length != 0) post.text = text;
    if (imageUrl) post.imageUrl = imageUrl;
    post.userId = userId;

    let response = await Post.create(post);
    await response.populate("userId");
    response = response.toObject();
    response.like = [];
    response.createdBy = response.userId;
    delete response.userId;
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    console.log("DELETE");

    const { id } = req.params;
    const userId = req.userId;

    if (!id) return res.status(400).json({ error: "Id is required" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Id is not valid" });

    const post = await Post.findById(id).select("userId").lean();

    if (!post) return res.status(400).json({ error: "Post not found" });

    if (post.userId.toString() !== userId) return res.status(403).json({ error: "Unautherised" });

    await Post.findByIdAndDelete(id, { select: "_id" });
    res.status(200).json({ success: true, message: "Post deleted succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { text } = req.body;
    const imageUrl = req.imageUrl;

    if (!id) return res.status(400).json({ error: "Id is required" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Id is not valid" });

    if (!text && !imageUrl) return res.status(400).json({ message: "Atleast image or text is required" });

    const post = await Post.findById(id).select("userId").lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (userId !== post.userId.toString()) return res.json({ message: "Unautherized" });

    const update = {};
    if (text) update.text = text;
    if (imageUrl) update.imageUrl = imageUrl;

    const response = await Post.findByIdAndUpdate(id, update, { new: true }).lean().select();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAllPosts = async (req, res) => {
  try {
    const response = await Post.deleteMany({});
    console.log(response);
    if (response) return res.status(200).json({ success: true, message: "All posts deleted succussfully" });
    res.sendStatus(500);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errro: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    if (!postId) return res.status(400).json({ error: "Id is required" });

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) return res.status(400).json({ error: "Post not found" });

    const alreadyLiked = await Like.exists({ userId, postId });

    if (alreadyLiked) {
      return res.status(200).json({ success: false, message: "Post has already been liked" });
    }

    const response = await Like.create({ userId, postId });
    res.json({ success: true, message: "Liked the post", data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const unLikePost = async (req, res) => {
  try {
    console.log("UNLIKE POST");
    const postId = req.params.id;
    const userId = req.userId;

    if (!postId) return sendError(res, 400, "Id is required");

    const postExists = await Post.exists({ _id: postId });
    console.log(postExists);
    if (!postExists) return sendError(res, 404, "Post not found");
    console.log(postExists);
    const like = await Like.findOne({ userId, postId });
    if (!like) return sendError(res, 400, "Post is not liked");

    const response = await Like.deleteOne({ userId, postId });
    res.status(200).json({ success: true, message: "Post has been unliked", data: like });
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
  getUsersPosts,
  deleteAllPosts,
  likePost,
  unLikePost,
};
