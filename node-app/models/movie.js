const mongoose = require('mongoose');
const {Schema} = mongoose;

const MovieSchema = new mongoose.Schema({
    movieId: {
        require: true,
        type: Number,
    },
    description: {
        require: true,
        type: String,
    },
    name: {
        require: true,
        type: String,
        unique: [true, 'name already exists']
    },
    picture: {
        require: true,
        type: String,
    },
    url: {
        require: true,
        type: String,
    },
    genre: {
        type: [],
    },
    year: {
        type: String,
    },
    companies: {
        type: [],
    },
    note: {
            rate: [{
                rates: Number,
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    default: null,
                }
            }],
    },
})

module.exports=mongoose.model('Movie', MovieSchema);