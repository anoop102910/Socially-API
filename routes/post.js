const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadImage = require("../middleware/uploadImage");

const { createPost, getAllPosts, deletePost, updatePost, getUsersPosts, deleteAllPosts, likePost, unLikePost } = require("../contollers/post");

router.get("/", auth, getAllPosts);
router.get("/all", auth, getUsersPosts);

router.post("/", auth, uploadImage, createPost);
router.post("/like/:id", auth, likePost);
router.post("/unlike/:id", auth, unLikePost);

router.put("/:id", auth, uploadImage, updatePost);

router.delete("/:id", auth, deletePost);
router.delete("/", auth, deleteAllPosts);
module.exports = router;
