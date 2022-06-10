
const db = require("../models/");

const POST = db.posts;
const Comment = db.comments;
const auth = require('../middleware/auth');//Récupération du middleware d'authentification//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
const { Console } = require("console");
const { hash } = require("bcrypt");
const { comments } = require("../models");
const dov = require('dotenv').config();

exports.createComment = (req, res) => {
  // Validate request
  const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//

const userId = decodedToken.userId;
  const postId = req.params.PostId;

  const commentario = {
    userId: userId,
    content: req.body.content,
    postId:postId,
    username:req.body.username
  };
  Comment.create(commentario)
    .then(data => {
      res.send(data);
      message: "Comment was updated successfully."
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Comment."
      });
    });
};



exports.modifyComment = (req, res) => {
  var id = req.params.CommentId;
  Comment.findByPk(id)
    .then(commentModif => {

      const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//

      const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token//

      req.auth = { userId };
      console.log(req.auth.userId);
      console.log(req.params.CommentId);
      const commentid = req.params.commentid
      const isAdmin = decodedToken.isAdmin;
      if (commentModif.userId !== req.auth.userId && isAdmin !== true) {
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        // Create a Tutorial
        const commentario = {
          content: req.body.content,
          username:req.body.username
          
        };
        Comment.update(commentario, {
          where: { id:req.params.CommentId }
        });
        res.send({
          message: "Comment was updated successfully."
        });
      }
    });
}
  ;

exports.deleteComment = (req, res) => {
  var id = req.params.CommentId;
  Comment.findByPk(id)
    .then(commentModif => {
     
      const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//

      const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token//

      req.auth = { userId };
      console.log(req.auth.userId);
      console.log(req.params.CommentId);
      const commentid = req.params.commentid
      const isAdmin = decodedToken.isAdmin;
      if (commentModif.userId !== req.auth.userId && isAdmin !== true) {
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
    
        // Create a Tutorial

        // Create a Tutorial
        Comment.destroy({
          where: { id: req.params.CommentId },

        });
        res.send({
          message: "Comment was delete successfully."
        });
      }
    });
}
  ;