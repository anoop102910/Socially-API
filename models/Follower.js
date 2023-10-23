const mongoose = require('mongoose');


const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',
  },
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;
