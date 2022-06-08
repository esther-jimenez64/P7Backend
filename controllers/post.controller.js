//*const { sign } = require("crypto");
const db = require("../models/");
const com = require("../models/comment.model");
const Op = db.Sequelize.Op;
const POST = db.posts;
const fs = require('fs');
const auth = require('../middleware/auth');//Récupération du middleware d'authentification//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
const { Console } = require("console");
const { hash } = require("bcrypt");
const { comments } = require("../models");
const dov = require('dotenv').config();

exports.createPost = (req, res) => {
  // Validate request
  console.log(req.headers.authorization) ; const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//

const userId = decodedToken.userId

if(req.file){
  const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const publication = {
    userId: userId,
    title: req.body.title,
    content:req.body.content,
    image:photo,
    username:req.auth.username
  };
  POST.create(publication)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
  }else{
    const publication = {
      userId: userId,
      title: req.body.title,
      content:req.body.content,
      username:req.body.username
    };
    POST.create(publication)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the POST."
        });
      });
  }
};

exports.findAllPublication = (req, res) => {
  return POST.findAll({
    include: [db.comments],
    order: [["id", "DESC"]]
  }).then((cities) => {
    res.send(cities);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving POSTS."
      });
    });
};

exports.findOnePost = (req, res) => {
  var id = req.params.id;
  console.log(id);
  POST.findByPk(id, { include: [db.comments] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find POST with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving POST with id=" + id
      });
    });
};

exports.modifyPost = (req, res) => {
  var id = req.params.id;
  POST.findByPk(id)
    .then(userModif => {
      console.log(req.auth.isAdmin);
      if (userModif.userId !== req.auth.userId && req.auth.isAdmin !== true) {
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        
        if(userModif.image == null ){
          const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const publication = {
            userId: req.auth.userId,
            title: req.body.title,
            content:req.body.content,
            username:req.body.username,
            image:photo
          };
          POST.update(publication, {
            where: { id: id }
          });
          res.send({
            message: "Post was updated successfully."
          });
       
        
      }else{
        let filenam = userModif.image.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. //
        fs.unlink(`images/${filenam}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. //
        })
      
          const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        // Create a Tutorial
          const publication = {
    userId: req.auth.userId,
    title: req.body.title,
    content:req.body.content,
    image:photo,
    username:req.body.username
  };
        POST.update(publication, {
          where: { id: id }
        });
        res.send({
          message: "Post was updated successfully."
        });

      }
    }
    });
}
  ;

exports.deletePost = (req, res) => {
  var id = req.params.id;
  POST.findByPk(id)
    .then(userModif => {
      console.log(id.userId);
      if (userModif.userId !== req.auth.userId && req.auth.isAdmin !== true) {
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        if(req.file){
        let filenam = userModif.image.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. //
        fs.unlink(`images/${filenam}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. //
        })
      }
        // Create a Tutorial
        db.posts.destroy({
           where: { id: id },include: [db.comments]
        });
        db.comments.destroy({
          where: { postId: id },
       });
        res.send({
          message: "POST was Delete successfully."
        });
      }
    });
}
  ;