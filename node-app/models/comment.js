const mongoose = require("mongoose");
const {Schema} = mongoose;

const commentSchema = new mongoose.Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    movieID: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
    },
    comment: {
        type: String,
        require: true,
    },
    time: { 
        type: Date,
        default: Date.now() 
    },
});

module.exports=mongoose.model("comment", commentSchema);;