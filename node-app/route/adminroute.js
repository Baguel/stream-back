const express = require('express');
const router=express.Router()
const User = require('../models/user');
const isadminAuth = require('../middleware/isadminauth')
const auth = require('../middleware/auth');
const { ObjectId } = require ('bson');
const { deleteUser, getUser, updateUser, getallUser, addmovie, getfilm, getfilmTmdb, addfilmTmdb, deletefilm, getfilmById, updatefilm } = require('../controller/adminController');

router.delete("/delete/:id", auth, isadminAuth, deleteUser)

router.get("/user/:id", auth, isadminAuth, getUser)

router.put("/update/:id", auth, isadminAuth, updateUser)

router.put("/update/film/:id", auth, isadminAuth, updatefilm)

router.post("/addfilm", auth, isadminAuth, addmovie)

router.post("/addfilm/v2/:id", auth, isadminAuth, addfilmTmdb)

router.get("/allfilm", auth, isadminAuth, getfilm)

router.delete("/deletefilm/:id", auth, isadminAuth, deletefilm)

router.get("/getfilm/:id", auth, isadminAuth, getfilmById)

router.get("/getUser", auth, isadminAuth, getallUser)

router.get("/tmdb/film/:page", auth, isadminAuth, getfilmTmdb)

module.exports=router;