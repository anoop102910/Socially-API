const sendError = require("../../helper/sendError");

const logout = (req, res) => {
  try {
    console.log('LOG OUT')
    res.cookie("token", "", { expires: new Date(0), httpOnly: true ,path:'/'});
    res.json({ success: true, message: "Cookie deleted" });
  } catch (error) {
    console.log(error);
    sendError(res, 500, error.message);
  }
};

module.exports = logout;
