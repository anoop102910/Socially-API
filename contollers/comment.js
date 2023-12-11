const sendError = require("../helper/sendError");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    const { text, postId } = req.body;
    const userId = req.userId;

    if (!text || text.lenght == 0 || !postId) sendError(res, 404, "All fields are required");

    const post = await Post.findById(postId);
    if (!post) return sendError(res, 404, "Post not found");

    const comment = await Comment.create({ text, userId, postId });
    return res.status(201).json({ success: true, comment });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const updateComment = async (req, res) => {
  const  commentId  = req.params.id;
  const { text } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

    return res.status(200).json({ success: true, comment });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getAllComments = async (req, res) => {
  try {
    const comment = await Comment.find();

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

    return res.status(200).json({ success: true, comment });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getComment = async (req, res) => {
  const  commentId  = req.params.id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

    return res.status(200).json({ success: true, comment });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createComment,
  updateComment,
  getComment,
  deleteComment,
  getAllComments,
};
