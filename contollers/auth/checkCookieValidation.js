const jwt = require("jsonwebtoken");
const { jwt_secret_key } = require("../../config/config");

const checkCookieValidation = (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ success: false, message: "Unautherized", error: "Token not found" });
  let decodedToken;
  jwt.verify(token, jwt_secret_key, (err, decode) => {
    if (err) return res.status(401).json({ success: false, message: "Unautherized", error: "Token has expired" });
    decodedToken = decode;
  });
  res.send({ success: true, message: "Autherized", message: decodedToken });
};

module.exports = checkCookieValidation;
