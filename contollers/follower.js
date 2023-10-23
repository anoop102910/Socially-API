const sendError = require("../helper/sendError");
const Follower = require("../models/Follower");

const followPerson = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    if (!followingId) return sendError(res, 400, "Id is reqquired");

    const exists = await Follower.exists({ followerId, followingId });
    if (exists) return sendError(res, 400, "Already following the person");

    const response = await Follower.create({ followerId, followingId });
    console.log(response);
    res.status(200).json({ success: true, message: "Following", data: response });
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

const unfollowPerson = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    if (!followingId) return sendError(res, 400, "Id is reqquired");

    const follower = await Follower.findOne({ followerId, followingId }).lean();
    if (!follower) sendError(res, 400, "Invalid request");

    const response = await Follower.findOneAndDelete({ followerId, followingId });
    console.log(response);

    res.status(200).json({ success: true, message: "Unfollowed the person", data: response });
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

const getConnections = async (req, res) => {
  try {
    const followerId = req.userId;

    let connections = await Follower.find({ followerId }).select("followingId").populate({ path: "followingId", select: "-password -email" }).lean();
    console.log(connections);
    connections.map(connection => {
      connection.connection = connection.followingId;
      delete connection.followingId;
    });
    res.status(200).json(connections);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { followPerson, unfollowPerson, getConnections };
