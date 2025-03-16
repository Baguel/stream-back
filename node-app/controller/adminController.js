const express = require('express');
const router=express.Router()
const User = require('../models/user');
const movie = require('../models/movie');
const bcrypt = require('bcrypt');
const axios = require('axios');

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({message: "User delete successfully"});
        } else {
            res.status(200).send({message: "User don't exist"});
        }
    } catch(err) {
        console.log(err);
    }
}

exports.getUser = async (req,res) => {
    const id = req.params.id;
    const user = await User.findById(id)
    if (user) {
        res.send({message: user})
    } else {
        res.status(404).send({message: "User not found"})
    }
}

exports.getallUser = async (req,res) => {
    const user = await User.find({isAdmin: 0})
    if (user) {
        res.send({message: user})
    } else {
        res.status(404).send({message: "User not found"})
    }
}

exports.updateUser = async(req, res) => {
    const id = req.params.id;
    const updated = req.body;
    let data = {};
    if (updated.password) {
        const hashed = await bcrypt.hash(updated.password, 10)
        data = {
            ...updated,
            password: hashed,
        }
    } else {
        data = {
            ...updated,
        }
    }
    try {
        const user = await User.findByIdAndUpdate(id, {$set: data});
        if (user) {
            res.status(200).send({message: "User update successfully"});
        } else {
            res.status(404).send({message: "user don't exist"});
        }
    } catch(err) {
        res.status(401).send({message: "An user already exist with this email or username" });
    }
}

//film crud
hello = async function(url, res, id) {
    await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD}`
        }
    }).then(async (response) => {
        try {
            if(url.includes('embed')){
                const film_to_add = await movie.create({
                    movieId: response.data.id,
                    name: response.data.title,
                    description: response.data.overview,
                    picture: "https://image.tmdb.org/t/p/w220_and_h330_face" + response.data.poster_path,
                    url: url,
                    genre: response.data.genres.map(genre => genre.name),
                    year: response.data.release_date.split("-")[0],
                    companies: response.data.production_companies.map(prod => prod.name),
                })
                res.status(200).send({message: "Movie add Successfully"})
            }
            else{
               return  res.status(401).send({message: "Bad url format you need embed url"})
            }
            
        } catch(error) {
            res.status(401).send({message: "Movie not add"})
        }

    })
}

exports.addmovie = async (req, res) => {
    const {name, url} = req.body;
    axios.get(`https://api.themoviedb.org/3/search/movie?query=${name}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD}`
        }
    }).then((response) => {
        if (response.data.results.length == 0) {
            res.status(404).send({message: "Film not found in the DB or mal ecrit"})
        } else {
            const film = response.data.results.find(({title}) => title === name);
            if (film) {
                hello(url, res, film.id)
            } else {
                const data = response.data.results[0];
                hello(url, res, data.id)
            }
        }
    }).catch(error => {
        console.log(error);
    })
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

exports.deletefilm = async (req, res) => {
    try {
        const id = req.params.id;
        const movies = await movie.findByIdAndDelete(id);
        if (movies) {
            res.status(200).send({message: "Movie delete successfully"});
        } else {
            res.status(200).send({message: "Movie don't exist"});
        }
    } catch(err) {
        console.log(err);
    }
}

exports.getfilmById = async (req,res) => {
    const id = req.params.id;
    const movies = await movie.findById(id)
    if (movies) {
        res.send({message: movies})
    } else {
        res.status(404).send({message: "User not found"})
    }
}

exports.updatefilm = async(req, res) => {
    const id = req.params.id;
    const updated = req.body;
    try {
        if(updated.url.includes("embed")){
            const movies = await movie.findByIdAndUpdate(id, {$set: updated});
            if (movies) {
                res.status(200).send({message: "Film update successfully"});
            } else {
                res.status(404).send({message: "Movie doesn't exist"});
            }
        }
        else{
          res.status(401).send({message: "url must be embed"});
        }
       
    } catch(err) {
        res.status(401).send({message: " An movie alredy exist with this name"});
        console.log(err);
    }
}

exports.getfilmTmdb = async (req, res) => {
    const page = req.params.page;
    await axios.get(`https://api.themoviedb.org/3/discover/movie?page=${page}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD}`
        }
    }).then((response) => {
        res.status(200).send({message: response.data})
    }).catch(error => {
        console.log(error);
    })
}

exports.addfilmTmdb = async (req, res) => {
    const id = req.params.id;
    await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD}`
        }
    }).then(async (response) => {
        try {
            const film_to_add = await movie.create({
                movieId: response.data.id,
                name: response.data.title,
                description: response.data.overview,
                picture: "https://image.tmdb.org/t/p/w220_and_h330_face" + response.data.poster_path,
                url: "",
                genre: response.data.genres.map(genre => genre.name),
                year: parseInt(response.data.release_date.split("-")[0]),
                companies: response.data.production_companies.map(prod => prod.name),
            })
            res.status(200).send({message: "Movie add Successfully"})
        } catch(error) {
            res.status(401).send({message: "Movie not add"})
        }

    })
}