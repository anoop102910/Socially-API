const storage = require("../firebase.config");
const { v4 } = require("uuid");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files) return next();
    const imageRef = ref(storage, `posts/${v4()}`);
    await uploadBytes(imageRef, req.files.image.data, { contentType: req.files.image.mimetype });
    console.log('Image uploaded to firebase')
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);
    req.imageUrl = imageUrl;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = uploadImage