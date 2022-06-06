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




// Create and Save a new Tutorial
exports.signup = (req, res) => {
  // Validate request
   //Condition si le mot de pass est trop court non//
   
  if (req.body.password.length < 5) { //Condition si le mot de pass est trop court non//
    throw "Invalid password";
  };
  if (req.body.password.length > 50) { //S'il est trop long non//
    throw "Invalid password";
  };
  const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/; //Regex pour valider le formulaire doit contenir 1 majuscule ////1 caractère spécial et un chiffre//
  if (!regexPassword.test(req.body.password)) { //Si la regex n'est pas respecté alors non//
    throw "Invalid password";
  };
  
  //Suite de ma logique une fois que le mot de pass  correspond  à se déclarer plus haut//
  bcrypt.hash(req.body.password, 10) //Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.//
   
    .then(hash => {
      // Create a Tutorial
      
      const utilisateur = {
        username: req.body.username,
        email: req.body.email,
        password: hash
      };
      const findEmail = USER.findOne({ where: { email: req.body.email} })
      // Save Tutorial in the database
      if (req.body.email != findEmail) {
    
      USER.create(utilisateur)
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
        throw"this email is already used"
      }
      
    });
    
  
};

exports.login = (req, res,) => {
  var email = req.body.email;

  const findEmail = USER.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        console.log('Not found!');
        res.status(401).json();
      }
      console.log("ehci");
      // Its primary key is 123
      var passwordAuth = req.body.password;
      if (user) {
      bcrypt.compare(passwordAuth, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });//S'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un ù^$******* message « Mot de passe incorrect !//
          } else {
            res.status(200).json({
              'username':user.username,
              'userId': user.id,
              'token': jwt.sign(
                { userId: user.id, isAdmin: user.isAdmin,username: user.username },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });

          }
        })
        .catch(error => res.status(500).json({ error }));
     } });
};

