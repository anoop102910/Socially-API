const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth')
const uploadProfile = require('../middleware/uploadProfile')

const {signin,signup, getUsers, getProfile, deleteAllUsers, getUser, uploadProfileImage} = require('../contollers/user')

router.post('/signin',signin);
router.post('/signup',signup);

router.get('/',auth,getUsers);
router.get('/:id',auth,getUser)
router.post('/profile',auth,uploadProfile,uploadProfileImage)
router.get("/getProfile",auth,getProfile);
router.delete('/',auth,deleteAllUsers)

module.exports = router;