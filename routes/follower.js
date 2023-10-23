const express = require("express");
const router = express.Router();

const auth  = require('../middleware/auth')
const { getConnections, followPerson, unfollowPerson } = require("../contollers/follower");

router.get("/", auth, getConnections);
router.post("/follow/:id", auth, followPerson);
router.post("/unfollow/:id", auth, unfollowPerson);

module.exports = router;
