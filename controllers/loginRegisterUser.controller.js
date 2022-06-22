const { sign } = require("crypto"); //Le module crypto Node.js fournit des fonctions cryptographiques pour vous aider à sécuriser app//
const db = require("../models"); /*const qui récupère le model schéma  squelize déclarer dans Models*/
const USER = db.users; /*récuperation du model users*/
const bcrypt = require("bcrypt"); //Récupération du package bycrypt un algorithme de hachage.//
const jwt = require("jsonwebtoken"); //Récupération du package JSON Web Token qui est un access token (jeton d’accès)//
const dov = require("dotenv").config(); //Récupération du package dotenv qui stocke des données sensibles dans des variables env//

// Create and Save a new User//
exports.signup = (req, res) => {
  if (req.body.password.length < 5) {
    //*Condition si le mot de pass est trop court non//
    throw "Invalid password";
  }
  if (req.body.password.length > 50) {
    //S'il est trop long non//
    throw "Invalid password";
  }
  const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/; //Regex pour valider le formulaire doit contenir 1 majuscule ////1 caractère spécial et un chiffre//
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(req.body.email)) {
    //Si la regex n'est pas respecté alors non//
    throw "Invalid email";
  }
  if (!regexPassword.test(req.body.password)) {
    //Si la regex n'est pas respecté alors non//
    throw "Invalid password";
  }

  //Suite de ma logique une fois que le mot de pass  correspond  à se déclarer plus haut//
  bcrypt
    .hash(req.body.password, 10) //Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.//

    .then((hash) => {
      const utilisateur = {
        //Création d'un objet contenant l'user créé par l'utilisateur contenue dans la requête//
        username: req.body.username,
        email: req.body.email,
        password: hash,
        isAdmin: req.body.isAdmin,
      };
      //Nous récupérons un user qui à le même email que l'email dans la database//
      const findEmail = USER.findOne({ where: { email: req.body.email } });
      if (findEmail == 0) {
        //si l'email communiqué est différent que celui de la database//
        USER.create(utilisateur) //Ensuite, nous créons l'user à envoyer à la base de donnée//
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
          
      } else {
        res.status(401).send({
          message:
            err.message || "THIS Email is already used",
        });
      }
    
    })
      .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User or the email is already used .",
            });
          });
    ;
   
};

// Création de la logique de ma route post qui permet de se connecter à un compte//
exports.login = (req, res) => {
  var email = req.body.email;
  const findEmail = USER.findOne({ where: { email: email } }) //Nous récupérons un user qui à le même email que l'email dans la database/
    .then((user) => {
      if (!user) {
        //si ce n'est pas le cas//
        console.log("User Not found!");
        res.status(401).json();
      }
      var passwordAuth = req.body.password;
      if (user) {
        //si l'email et bien dans la database//
        bcrypt
          .compare(passwordAuth, user.password) //Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données.//
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" }); //S'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un  message « Mot de passe incorrect !//
            } else {
              //S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur  un token s'il est admin ainsi que son username//
              res.status(200).json({
                username: user.username,
                userId: user.id,
                token: jwt.sign(
                  {
                    userId: user.id,
                    isAdmin: user.isAdmin,
                    username: user.username,
                  },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    });
};
