  var auth = require('../middleware/auth');
  const express = require('express');
  const {param} = require('../app');
    const users = require("../controllers/loginRegisterUser.controller");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/signup", users.signup);
    router.post("/login", users.login);
 
    module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//
    // Retrieve all Tutorial
 
