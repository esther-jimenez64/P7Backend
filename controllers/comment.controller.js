
const db = require("../models/");           /*const qui récupère le model schéma  squelize déclarer dans Models*/
const POST = db.posts;                       /*récuperation du model posts*/
const Comment = db.comments;                 /*récuperation du model comments*/
const auth = require('../middleware/auth');  //Récupération du middleware d'authentification//
const bcrypt = require("bcrypt");            //Récupération du package bycrypt un algorithme de hachage.//
const jwt = require("jsonwebtoken");        //Récupération du package JSON Web Token qui est un access token (jeton d’accès)//
const dov = require('dotenv').config(); //Récupération du package dotenv qui stocke des données sensibles dans des variables env//

exports.createComment = (req, res) => { /*logique création commentaire*/
  const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//
  const userId = decodedToken.userId;                          /*Nous lui attribution le userId décoder*/
  const postId = req.params.PostId;                            /*Nous récupérant l'id du post contenue dans les params Url*/

  const commentario = {             //Création d'un objet contenant le commentaire créé par l'utilisateur contenue dans la requête//
    userId: userId,
    content: req.body.content,
    postId:postId,
    username:req.body.username
  };
  Comment.create(commentario)  //Ensuite, nous créons le commentaire à envoyer à la base de donnée//
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

/*Création de la logique de ma route put qui permet de modifier un comment spécifique*/
exports.modifyComment = (req, res) => { 
  var id = req.params.CommentId;        /*Récupération de l'id du comment contenue dans params URL*/
  Comment.findByPk(id)                 /*Nous recherchons le commentaire dans la base de donnée par l'id*/
    .then(commentModif => {
      const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//
      const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token//
      req.auth = { userId };              //Nous assignons la valeur de la variable  userId  à la clé  userId  de l'objet  auth//
      const isAdmin = decodedToken.isAdmin; //Nous extrayons la valeur Booléen et l'assignons a la const//
      if (commentModif.userId !== req.auth.userId && isAdmin !== true) { // ID utilisateur de la demande, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur et également si l'user n'est pas admin //
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        const commentario = {     //Création d'un objet contenant le commentaire modifié par l'utilisateur contenue dans la requête//
          content: req.body.content,
          username:req.body.username,
          title:req.body.title
        };
        Comment.update(commentario, {         //Ensuite, nous créons le commentaire à envoyer à la base de donnée/
          where: { id:req.params.CommentId }  /*Et  modifions uniquement le comment qui a  l'id  égal que c'elle de l'url params*/
        });
        res.send({
          message: "Comment was updated successfully."
        });
      }
    });
};

/*Création de la logique de ma route delete qui permet de supprimer  un comment spécifique */
exports.deleteComment = (req, res) => {
  var id = req.params.CommentId;  /*Récupération de l'id du comment contenue dans params URL*/
  Comment.findByPk(id)    /*Nous recherchons le commentaire dans la base de donnée par l'id*/
    .then(commentModif => {
     
      const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//
      const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token//
      req.auth = { userId };               //Nous assignons la valeur de la variable  userId  à la clé  userId  de l'objet  auth//
      const isAdmin = decodedToken.isAdmin;//Nous décodant la valeur Booléen et l'assignons a la const//
      if (commentModif.userId !== req.auth.userId && isAdmin !== true) {//*ID utilisateur de la demande, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur et également si l'user et admin //
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        // Delete Comment//
        Comment.destroy({ //Ensuite, nous détruisent le commentaire et envoyons à la base de donnée//
          where: { id: req.params.CommentId },/*Et supprimons uniquement le comment qui a  l'id  égal que c'elle de l'url params*/
        });
        res.send({
          message: "Comment was delete successfully."
        });
      }
    });
}
  ;