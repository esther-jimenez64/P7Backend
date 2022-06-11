var auth = require('../middleware/auth');//Récupération du middleware d'authentification//
const express = require('express'); //L'utilisation du framework Express simplifie les tâches et pour créer une application simple//
  const commente = require("../controllers/comment.controller");
  var router = require("express").Router(); //Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations
  router.post("/:PostId", auth,commente.createComment);//route post pour créer un comment avec son contrôleur //
  router.put("/:id/:PostId/:CommentId", auth, commente.modifyComment);//route put modifier pour créer un comment avec son contrôleur //
  router.delete("/:id/:CommentId", auth,commente.deleteComment); //route delete pour supprimer un comment avec son contrôleur //
  module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//
