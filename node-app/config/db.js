require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL).then(res => {
    console.log("Connected successfully to DB");
}).catch(error => {
    console.log(error);
})