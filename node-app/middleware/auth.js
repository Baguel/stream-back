const express = require('express')
require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const header = req.headers.authorization;
    try {
        const token = header.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).send("Bad token");
            } else {
                req.user = user.user;
                next();
            }
        })
    } catch(err) {
        console.log(err)
        res.status(401).send("token invalide");
    }
}

module.exports=auth;