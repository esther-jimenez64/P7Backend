var auth = require('../middleware/auth');
  const express = require('express');
  const {param} = require('../app');
    const posts = require("../controllers/post.controller");
    var router = require("express").Router();
    const multer = require('../middleware/multer-config');

    router.post("/create",auth, multer, posts.createPost);
    router.get("/post",auth, multer, posts.findAllPublication);
    router.get("/:id",  auth, multer, posts.findOnePost);
    router.put("/:id", auth, multer, posts.modifyPost);
    router.delete("/:id", auth, multer, posts.deletePost);
 
    module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//
    // Retrieve all Tutorial
 