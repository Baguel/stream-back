const express = require('express');
const router=express.Router()
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userfind = await User.find({email: email})
        if (userfind.length != 0) {
            res.status(401).send({message: "User already exits this email or username"})
        } else {
            const hashed = await bcrypt.hash(password, 10)
            await User.create({
                username,
                email,
                password: hashed,
            })
            res.status(201).send({message: "User added successfully"})
        }
    } catch(error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const userfind = await User.find({email: email});
        if (userfind.length == 0) {
            res.status(404).send({message: "User not found"})
        } else {
            if (await bcrypt.compare(password, userfind[0].password)) {
                const token = jwt.sign({user: userfind}, process.env.JWT_SECRET, {
                    expiresIn: '24h'
                })
                res.status(200).send({message: "Connected", token: token})
            } else {
                res.status(401).send({message: "Bad Password"})
            }
        }
    } catch(error) {
        console.log(error);
    }
})

module.exports=router