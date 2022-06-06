var auth = require('../middleware/auth');
const express = require('express');
const {param} = require('../app');
  const commente = require("../controllers/comment.controller");
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/:PostId", auth,commente.createComment);
  router.put("/:id/:PostId/:CommentId", auth, commente.modifyComment);
  router.delete("/:id/:CommentId", auth,commente.deleteComment);
  module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//
  // Retrieve all Tutorial
