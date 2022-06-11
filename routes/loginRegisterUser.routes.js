  var auth = require('../middleware/auth');  /*Récupération du middleware d'authentification*/
  const express = require('express');   //L'utilisation du framework Express simplifie les tâches et pour créer une application simple//
    const users = require("../controllers/loginRegisterUser.controller");
    var router = require("express").Router(); //Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations
    router.post("/signup", users.signup);//route post pour créer un compte avec son contrôleur //
    router.post("/login", users.login);  //route post pour la connexion à un compte créé avec son contrôleur//
    module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//
 
