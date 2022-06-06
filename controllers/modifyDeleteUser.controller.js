const { sign } = require("crypto");
const db = require("../models");
const Op = db.Sequelize.Op;
const USER = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
const { Console } = require("console");
const { hash } = require("bcrypt");
const dov = require('dotenv').config();
const auth = require('../middleware/auth');//Récupération du middleware d'authentification//
exports.modify = (req, res) => {
    var email = req.body.email;
    var id = req.body.id;
    USER.findOne({ where:{id: req.params.id }})
      .then(userModif => {
          console.log(req.auth.isAdmin);
        if( id ===  req.auth.userId | req.body.isAdmin === true ){
          res.status(200);
        }
        if(req.body. password.length < 5){ //Condition si le mot de pass est trop court non//
          throw "Invalid password"
        };
        if(req.body.password.length > 50){ //S'il est trop long non//
          throw "Invalid password"};
        const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/ //Regex pour valider le formulaire doit contenir 1 majuscule ////1 caractère spécial et un chiffre//
        if(!regexPassword.test(req.body.password)){ //Si la regex n'est pas respecté alors non//
          throw "Invalid password"
        };
        //Suite de ma logique une fois que le mot de pass  correspond  à se déclarer plus haut//
        bcrypt.hash(req.body.password, 10) //Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.// 
          .then(hash => {
        // Create a Tutorial
        const utilisateur = {
            email: req.body.email,
            username: req.body.username,
            password: hash
        }; 
        USER.update(utilisateur, {
          where: { id: req.params.id}
        })
        res.send({
          message: "User was updated successfully."
        });
      })
    })
  };
  
  exports.delete = (req, res) => {
    var email = req.body.email;
    var userId = req.params.id;
  
    USER.findOne({ where:{id: req.params.id }})
      .then(userModif => {
          console.log(userModif);
          if(userModif.id !== req.auth.userId && req.auth.isAdmin !== true){
            return res.status(400).json({ error: "Unauthorized request" });
          }else{
        // Create a
          res.status(200);
          USER.destroy( {
            where: { id: req.params.id },
            
          })
          db.posts.destroy({
            where: { userId: req.params.id }
         });
         db.comments.destroy({
           where: { userId: req.params.id },
        });
          res.send({
            message: "User was delete successfully."
          });
        }
      })
  };
  
  exports.findOneUser = (req, res) => {
    var id = req.params.id;
    console.log(id);
    USER.findByPk(id)
      .then(data => {
        console.log(data);
        if(data.id !== req.auth.userId && req.auth.isAdmin !== true){
          return res.status(400).json({ error: "Unauthorized request" });
        } else {
          res.send(data)
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };