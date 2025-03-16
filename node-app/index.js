const express = require("express");
const app = express();
const db = require('./config/db')
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRoute = require('./route/authroute');
const userRoute = require('./route/userRoute');
const adminRoute = require('./route/adminroute');
const cors = require('cors');
const axios = require('axios');

const corsOpts = {
    'Access-Control-Allow-Origin': '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ],
};

app.use(cors(corsOpts));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use("/uploads", express.static('uploads'))

app.get("/", (req, res) => {
  res.send('hello world')
})

app.listen(3001, () => {
    console.log(`Example app listening on port 3001`);
})