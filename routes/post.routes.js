var auth = require('../middleware/auth');/*Récupération du middleware d'authentification*/
  const express = require('express');    //Récupération du framework express//
    const posts = require("../controllers/post.controller");
    var router = require("express").Router();/*Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations*/
    const multer = require('../middleware/multer-config');  /*Fonctionnalité​ qui nous permet de traiter les téléchargements de fichiers avec notre application Express​*/
    router.post("/create",auth, multer, posts.createPost);//post qui créer un post//
    router.get("/post",auth, multer, posts.findAllPublication);//get qui récupère toutes les posts dispo ajout de mon contrôleur pour les posts//
    router.get("/:id",  auth, multer, posts.findOnePost); ///get qui récupère un post  spécifique avec l'id  ajout de mon contrôleur/
    router.put("/:id", auth, multer, posts.modifyPost);  //put qui modifie un post //
    router.delete("/:id", auth, multer, posts.deletePost); //delete qui supprime un post //
    module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//

 