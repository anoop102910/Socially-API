const mongoose = require('mongoose')
friendSchema = mongoose.Schema({
    user1Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    user2Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:['pending','accepted']
    }
})
module.exports = mongoose.model('Friend',friendSchema);