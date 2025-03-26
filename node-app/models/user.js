const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        require: true,
        unique: true,
        type: String,
    },
    email: {
        require: true,
        unique: true,
        type: String,
    },
    isAdmin: {
        type: Number,
        default: 0,
    },
    favorite: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Movie'
          }],
          default: []
    },
    password: {
        require: true,
        type: String, 
    }
})

module.exports=mongoose.model('User', userSchema);