const {
  createComment,
  deleteComment,
  getComment,
  updateComment,
  getAllComments,
} = require("../contollers/comment");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router
  .get("/", auth, getAllComments)
  .get("/:id", auth, getComment)
  .post("/", auth, createComment)
  .put("/:id", updateComment)
  .delete("/:id", deleteComment);
module.exports = router;
