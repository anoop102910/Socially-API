const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwt_secret_key, server_url } = require("../config/config");
const sendError = require("../helper/sendError");

const signup = async (req, res) => {
  try {
    console.log("SIGNUP");
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      firstName?.length == 0 ||
      lastName?.length == 0 ||
      email?.length == 0 ||
      password?.length == 0 ||
      confirmPassword?.length == 0
    )
      return res.status(400).json({ error: "All fields are required" });

    if (password !== confirmPassword) return res.status(400).json({ error: "Password and Confirm password should match" });

    const userExists = await User.exists({ email });
    console.log(userExists);

    if (userExists) return res.status(409).json({ error: "User already exists" });

    const newPassword = await bcrypt.hash(password, 11);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: newPassword,
    });

    const token = jwt.sign({ userId: user._id, name: user.firstName + " " + user.lastName }, jwt_secret_key, { expiresIn: "24h" });
    console.log(token);
    res.cookie("token", token, { maxAge: 36000000, path: "/", httpOnly: true, secure: true, sameSite: none, domain: server_url });
    res.status(200).json({ succuss: true, message: "Signin succussful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    if (email?.length == 0 || password?.length == 0) return res.status(400).json({ error: "All fields are required" });

    let user = await User.find({ email }).lean();
    user = user[0];

    if (!user) return res.status(400).json({ error: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return res.status(400).json({ error: "Password is incorrect" });

    const tokenVal = { userId: user._id, name: user.firstName + " " + user.lastName };
    if (user.profileImage) tokenVal.profileImage = user.profileImage;

    const token = jwt.sign(tokenVal, jwt_secret_key, { expiresIn: "24h" });
    // console.log(token);
    res.cookie("token", token, { maxAge: 36000000, path: "/", httpOnly: true, secure: true, sameSite: none, domain: server_url });
    res.status(200).json({ succuss: true, message: "Signin succussfull" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = (req, res) => {
  try {
    const id = req.params.id;
    const user = User.findOne({ id }).lean().select("-password -email");
    res.json(user);
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await User.find().select("-emial -password").lean();
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await User.findById(userId).select("-email -password").lean();
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    const response = await User.deleteMany({});
    console.log(response);
    if (response) return res.status(200).json({ success: true, message: "All posts deleted succussfully" });
    res.sendStatus(500);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { profileImage: req.imageUrl });
    res.json({ success: true, message: "Profile Image uploaded", imageLink: req.imageUrl });
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

module.exports = {
  signin,
  signup,
  getUsers,
  getProfile,
  deleteAllUsers,
  getUser,
  uploadProfileImage,
};
