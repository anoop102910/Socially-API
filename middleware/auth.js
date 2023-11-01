const jwt = require("jsonwebtoken");
const { jwt_secret_key } = require("../config/config");

const auth = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized', error: "Token not found" });

  token = token.replace("Bearer ", "");

  jwt.verify(token, jwt_secret_key, (err, decode) => {
    if (err) return res.status(401).json({ success: false, message: "Unauthorized", error: "Token has expired" });
    const { userId } = decode;
    req.userId = userId;
    next();
  });
};

module.exports = auth;
