const { sign } = require("crypto"); //Le module crypto Node.js fournit des fonctions cryptographiques pour vous aider à sécuriser app//
const db = require("../models"); /*const qui récupère le model schéma  squelize déclarer dans Models*/
const USER = db.users; /*récuperation du model users*/
const bcrypt = require("bcrypt"); //Récupération du package bycrypt un algorithme de hachage.//
const jwt = require("jsonwebtoken"); //Récupération du package JSON Web Token qui est un access token (jeton d’accès)//
const dov = require("dotenv").config(); //Récupération du package dotenv qui stocke des données sensibles dans des variables env//
const auth = require("../middleware/auth"); //Récupération du middleware d'authentification//

/*Création de la logique de ma route put qui permet de modifier un user spécifique*/
exports.modify = (req, res) => {
  var id = req.body.id; //Récupération de l'id de l'user contenu dans la requête//
  USER.findOne({ where: { id: req.params.id } }) //Nous récupérons un user qui à le même id  que l'id dans la database//
    .then((userModif) => {
      if ((id === req.auth.userId) | (req.body.isAdmin === true)) {
        //Si l'user Id et = le même que celui de la requête ou que l'admin et = true//
        res.status(200);
      }
      if (req.body.password.length < 5) {
        //Condition si le mot de pass est trop court non//
        throw "Invalid password";
      }
      if (req.body.password.length > 50) {
        //S'il est trop long non//
        throw "Invalid password";
      }
      const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/; //Regex pour valider le formulaire doit contenir 1 majuscule ////1 caractère spécial et un chiffre//
      if (!regexPassword.test(req.body.password)) {
        //Si la regex n'est pas respecté alors non//
        throw "Invalid password";
      }
      //Suite de ma logique une fois que le mot de pass  correspond  à se déclarer plus haut//
      bcrypt
        .hash(req.body.password, 10) //Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.//
        .then((hash) => {
          const utilisateur = {
            //Création d'un objet contenant l'user modifier par l'utilisateur contenue dans la requête//
            email: req.body.email,
            username: req.body.username,
            password: hash,
          };
          USER.update(utilisateur, {
            //Ensuite nous mettons à jours l'user et l'envoyons à la base de donnée//
            where: { id: req.params.id },
          });
          res.status(200).json({
            username: req.body.username,
            userId: req.body.id,
            token: jwt.sign(
              { userId: req.body.id, username: req.body.username },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            ),
          });
        });
    });
};

//Création de la logique de ma route delete qui permet de supprimer  un user spécifique exports pour pouvoir la récupérer  et l'affecté à ma route */
exports.delete = (req, res) => {
  USER.findOne({ where: { id: req.params.id } }) //Nous récupérons un user qui à le même email que l'email dans la database//
    .then((userModif) => {
      console.log(userModif);
      if (userModif.id !== req.auth.userId && req.auth.isAdmin !== true) {
        //Si l'user Id et n'est pas le même que celui de la requête ou que l'admin et = false//
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        // Create a
        res.status(200);
        USER.destroy({
          //Ensuite, nous détruisent l'user et envoyons à la base de donnée//
          where: { id: req.params.id },
        });
        db.posts.destroy({
          //Ensuite, nous détruisent les posts ou l'userId et le même que l'user supprimer//
          where: { userId: req.params.id },
        });
        db.comments.destroy({
          //Ensuite, nous détruisent les comments ou l'userId et le même que l'user supprimer/
          where: { userId: req.params.id },
        });
        res.send({
          message: "User was delete successfully.",
        });
      }
    });
};

//Création de la logique de ma route get qui permet de récupérer  un user spécifique //
exports.findOneUser = (req, res) => {
  var id = req.params.id; //Récupération de l'id  contenu dans params Url//
  USER.findByPk(id) /*Nous recherchons l'user dans la base de donnée par l'id*/
    .then((data) => {
      console.log(data);
      if (data.id !== req.auth.userId && req.auth.isAdmin !== true) {
        //Si l'user Id et n'est pas le même que celui de la requête ou que l'admin et = false//
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};
