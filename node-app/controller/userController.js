const express = require('express');
const router=express.Router()
const User = require('../models/user');
const movie = require('../models/movie');
const bcrypt = require('bcrypt');
const { ObjectId } = require ('bson');

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user[0]._id);
        if (user) {
            res.status(200).send({message: "user delete successfully"});
        } else {
            res.status(200).send({message: "user don't exist"});
        }
    } catch(err) {
        console.log(err);
    }
}

exports.getUser = async (req,res) => {
    const user = await User.findById(req.user[0]._id)
    if (user) {
        res.send({message: user})
    } else {
        res.status(404).send({message: "User not found"})
    }
}

exports.updateUser = async(req, res) => {
    const updated = req.body;
    const user = await User.findById(req.user[0]._id);
    let data = {};
    if (await bcrypt.compare(updated.old, user.password)) {
        if (updated.newpass === updated.confirmpass) {
            const hashed = await bcrypt.hash(updated.newpass, 10)
            data = {
                password: hashed,
            }
            try {
                const user = await User.findByIdAndUpdate(req.user[0]._id, {$set: data});
                if (user) {
                    res.status(200).send({message: "User update successfully"});
                } else {
                    res.status(404).send({message: "user don't exist"});
                }
            } catch(err) {
                console.log(err);
            }
        } else {
            res.status(401).send({message: "Passwords don't watch"});
        }
    } else {
        res.status(401).send({message: "Bad old password"});
    }
}

exports.updateUserInfo = async(req, res) => {
    const updated = req.body;
    const user = await User.findById(req.user[0]._id);
    let data = {};
    if (await bcrypt.compare(updated.password, user.password)) {
        data = {
            email : updated.email,
            username: updated.username,
        }
        try {
            const user = await User.findByIdAndUpdate(req.user[0]._id, {$set: data});
            if (user) {
                res.status(200).send({message: "User update successfully"});
            } else {
                res.status(404).send({message: "user don't exist"});
            }
        } catch(err) {
            res.status(401).send({message: "An user already exist with this email or username"});
        }
    } else {
        res.status(401).send({message: "Bad Password"});
    }
}

exports.getfilm = async(req, res) => {
    try {
        const film = await movie.find();
        if (film) {
            res.status(200).send({message: film})
        } else {
            res.status(404).send({message: "film not found"})
        }
    } catch(error) {
        console.log(error)
    }
}

exports.getfilmById = async (req,res) => {
    const id = req.params.id;
    const film = await movie.findById(id)
    if (film) {
        res.send({message: film})
    } else {
        res.status(404).send({message: "film not found"})
    }
}

exports.favorite = async (req,res) => {
    const id = req.params.id;
    const film = await movie.findById(id)
    const userfind = await User.findById(req.user[0]._id);
    if (film) {
        if (userfind.favorite.includes(film._id)) {
            res.status(401).send({message: "film already in favorite"})
        } else {
            try {
                const userUpdate = await User.findByIdAndUpdate(userfind._id, { $push: { favorite: film._id } })
                res.status(200).send({message: "film add to favorite"})
            } catch (error) {
                console.log(error)
                res.status(401).send({message: "film not found"})
            }
        }
    } else {
        res.status(404).send({message: "film not found"})
    }
}

exports.deletefavorite = async (req,res) => {
    const nom = req.params.id;
    const film = await movie.findById(nom)
    if (film) {
        try {
            const userUpdate = await User.findByIdAndUpdate(req.user[0]._id, { $pull: { favorite: film._id } })
            res.status(200).send({message: "film delete from favorite"})
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(404).send({message: "film not found"})
    }
}

exports.allfavorite = async (req,res) => {
        try {
            const favorite = await User.findById(req.user[0]._id).populate("favorite");
            res.status(200).send({message: favorite })
        } catch (error) {
            console.log(error)
        }
}

exports.searchMovie = async (req,res) => {
    const film = req.params.search;
    const searchdata = new RegExp(film, 'i');
    const result = await movie.find({
      $or: [
        { name: searchdata },
        { year: searchdata },
        { genre: searchdata },
        { companies: searchdata },
      ],
    }); 
    if (result) {
        res.status(200).send({message: result})
    } else {
        res.status(404).send({message: "not film found"})
    }
}


exports.ratefilm = async (req,res) => {
    const id = req.params.id;
    const rate = req.params.rate;
    const film = await movie.findById(id)
    const userfind = await User.findById(req.user[0]._id);
    if (film) {
        if (userfind.favorite.includes(film._id)) {
            res.status(401).send({message: "film already in favorite"})
        } else {
            try {
                const data = film.rate.find(({user}) => user.toString() === req.user[0]._id.toString())
                if(data) {
                    film.rate.push({rates: rate})
                    await film.save();
                    res.status(200).send({message: "rate update"})
                } else {
                    film.rate.push({ rates: rate, user: req.user[0]._id });
                    await film.save();
                    res.status(200).send({message: "rate add"})
                }
            } catch (error) {
                console.log(error)
                res.status(401).send({message: "film not found"})
            }
        }
    } else {
        res.status(404).send({message: "film not found"})
    }
}