const comment = require("../models/comment");
const movie = require("../models/movie")

const AddComment = (req, res) => {
    const id = req.params.id;
  comment
    .create({
        movieID: id,
        userID: req.user[0]._id,
        comment: req.body.comment,
    })
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ msg: error }));
};
const delcomment = (req, res) => {
    const commentID = req.params.id;
  comment
    .findOneAndDelete({ _id: commentID })
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ msg: 'comment not found' }));
};

const updatecomment = (req, res) => {
    const idd = req.params.id;
    comment
      .findOneAndUpdate(
        { _id: idd },
        {
          $set: { comment: req.body.comment },
        },
        { new: true }
      )
      .then((result) => res.status(200).json({ result ,msg:"comment added"}))
      .catch((error) => res.status(500).json({ msg: "comment not found" }));
};
  
const getcomment = async(req, res) => {
  const movieidd = req.params.id;

  const filme = movie.findById(movieidd);
  const comments = await comment.find({ movieID: movieidd }).populate("userID").then((result) => res.status(200).json({ result })).catch((error) => console.log(error));
};

module.exports = {
    AddComment,
    delcomment,
    updatecomment,
    getcomment
};