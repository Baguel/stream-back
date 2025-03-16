const express = require('express');
const router=express.Router()
const User = require('../models/user');
const auth = require('../middleware/auth')
const { ObjectId } = require ('bson');
const { deleteUser, getUser, updateUser, updateUserInfo, getfilm, getfilmById, favorite, deletefavorite, searchMovie, allfavorite, ratefilm } = require('../controller/userController');
const { AddComment,delcomment, updatecomment,getcomment } = require('../controller/commentaireController');

router.delete("/delete", auth, deleteUser)

router.get("/user", auth, getUser)

router.get("/film", getfilm)

router.get("/film/:id", auth, getfilmById)

router.post("/addfavorite/film/:id", auth, favorite)

router.get("/favorite", auth, allfavorite)

router.delete("/deletefavorite/film/:id", auth, deletefavorite)

router.put("/update", auth, updateUserInfo)

router.put("/update/pass", auth, updateUser)

router.post('/comment/:id', auth, AddComment)

router.post('/rate/:id/:rate', auth, ratefilm)

router.delete('/comment/:id', auth, delcomment)

router.get('/comment/movie/:id', auth, getcomment)

router.put('/comment/:id', auth, updatecomment)
 
router.get('/search/:search', searchMovie)

module.exports=router;