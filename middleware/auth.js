const jwt = require("jsonwebtoken");
const { jwt_secret_key } = require("../config/config");
const auth = (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token)
  if (!token) return res.status(401).json({ success:false,message:'Unautherized',error:"Token not found"});
  jwt.verify(token, jwt_secret_key, (err, decode) => {
    if (err) return res.status(401).json({ success:false,message:"Unautherized",error:"Token has expired" });
    // console.log(decode);
    const {userId} = decode;
    req.userId = userId
  });
  next();
};

module.exports = auth;
