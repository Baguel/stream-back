const express = require('express')
require('dotenv').config();
const jwt = require('jsonwebtoken');

const isadminAuth = (req, res, next) => {
    if (req.user[0].isAdmin == 1) {
        next();
    } else {
        console.log("you're not admin")
    }
}

module.exports=isadminAuth;