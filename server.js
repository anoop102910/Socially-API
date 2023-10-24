const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { mongoUrI ,server_url} = require("./config/config");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const followerRoute = require("./routes/follower");
const checkCookieValidation = require("./contollers/auth/checkCookieValidation");
const logout = require("./contollers/auth/logout");

const app = express();

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: "10*1024*1024" } }));
app.use(
  cors({
    origin: server_url,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
app.use("/api/follower", followerRoute);


app.get("/", (req, res) => {
  res.status(200).json({ succuss: true, message: "Listening on port number 5000" });
});

app.get('/check-cookie-validation',checkCookieValidation);
app.get('/logout',logout)

app.get("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

mongoose
  .connect(mongoUrI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

const PORT = 5000;


app.listen(PORT, err => {
  if (err) console.log(err);
  else console.log(`Listening on port number ${PORT}`);
});
