const { sign } = require("crypto");  //Le module crypto Node.js fournit des fonctions cryptographiques pour vous aider à sécuriser app//
const db = require("../models/");    /*const qui récupère le model schéma  squelize déclarer dans Models*/
const POST = db.posts;                                /*récuperation du model posts*/
const fs = require('fs') //Récupération du module fs fournit de nombreuses fonctionnalités comme fs.unlink pour supprimer des fichiers//
const auth = require('../middleware/auth');//Récupération du middleware d'authentification//
const bcrypt = require("bcrypt");          //Récupération du package bycrypt un algorithme de hachage.// 
const jwt = require("jsonwebtoken");        //Récupération du package JSON Web Token qui est un access token (jeton d’accès)//
const { comments } = require("../models");  /*récuperation du model comments*/
const dov = require('dotenv').config();     //Récupération du package dotenv qui stocke des données sensibles dans des variables env//

exports.createPost = (req, res) => { /*logique création post*/
  console.log(req.headers.authorization) ; const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Nous utilisons ensuite la fonction verify pour décoder notre token//
  const userId = decodedToken.userId //Nous extrayons l'ID utilisateur de notre token//
if(req.file){  //vérifier si fichier image existe ou non S'il existe, on traite la nouvelle image//
  const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;//Reconstruire l'URL complète du fichier enregistré//
  const publication = {                //Création d'un objet contenant le post créé par l'utilisateur contenue dans la requête//
    userId: userId,
    title: req.body.title,
    content:req.body.content,
    image:photo,
    username:req.auth.username
  };
  POST.create(publication)   //Ensuite, nous créons le posts à envoyer à la base de donnée//
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
  }else{//Vérifier si fichier image  n'existe pas dans cas là, nous n'envoyons pas d'image//
    const publication = {
      userId: userId,
      title: req.body.title,
      content:req.body.content,
      username:req.body.username
    };
    POST.create(publication)  //Ensuite, nous créons le posts à envoyer à la base de donnée//
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the POST."
        });
      });
  }
};
//Notre logique GET qui renvoie toutes les posts disponibles dans la base de données//
exports.findAllPublication = (req, res) => {
  return POST.findAll({  //Nous récupérons les posts avec les comment en ordre du dernier publier//
    include: [db.comments],
    order: [["id", "DESC"]]
  }).then((cities) => {
    res.send(cities);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving POSTS."
      });
    });
};

//Notre logique GET qui renvoie un post spécifique//
exports.findOnePost = (req, res) => {
  var id = req.params.id;                        //Récupération de l'id  contenu dans params Url//
  console.log(id);
  POST.findByPk(id, { include: [db.comments] })  //Nous récupérons le post avec les comments //
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find POST with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving POST with id=" + id
      });
    });
};

/*Création de la logique de ma route put qui permet de modifier un post spécifique*/
exports.modifyPost = (req, res) => {
  var id = req.params.id;              //Récupération de l'id  contenu dans params Url//
  POST.findByPk(id)                   //Nous récupérons le post qui  contient cette id//
    .then(postModif => {
      if (postModif.userId !== req.auth.userId && req.auth.isAdmin !== true) {//Si l'user Id et n'est pas le même que celui de la requête ou que l'admin et = false//
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        
        if(postModif.image == null ){ //si fichier image  n'existe pas dans cas là, nous n'envoyons la nouvelle d'image//
          const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;//Reconstruire l'URL complète du fichier enregistré.//
          const publication = {      //Création d'un objet contenant le post modifié par l'utilisateur contenue dans la requête//
            userId: req.auth.userId,
            title: req.body.title,
            content:req.body.content,
            username:req.body.username,
            image:photo
          };
          POST.update(publication, { //Ensuite, nous créons le post à envoyer à la base de donnée/
            where: { id: id }
          });
          res.send({
            message: "Post was updated successfully."
          });
       
        
      }else{/**si le post contient une image */
        let filenam = postModif.image.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. //
        fs.unlink(`images/${filenam}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. //
        })
          const photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;//Reconstruire l'URL complète du fichier enregistré.//
          const publication = {            //Création d'un objet contenant le post modifié par l'utilisateur contenue dans la requête//
    userId: req.auth.userId,
    title: req.body.title,
    content:req.body.content,
    image:photo,
    username:req.body.username
  };
        POST.update(publication, {  //Ensuite, nous créons le post à envoyer à la base de donnée/
          where: { id: id }
        });
        res.send({
          message: "Post was updated successfully."
        });

      }
    }
    });
}
  ;
  
  /*Création de la logique de ma route delete qui permet de supprimer  un post spécifique */
exports.deletePost = (req, res) => {
  var id = req.params.id;                      /*Récupération de l'id du comment contenue dans params URL*/
  POST.findByPk(id)                            /*Nous recherchons le commentaire dans la base de donnée par l'id*/
    .then(postDelete => {
      console.log(id.userId);
      if (postDelete.userId !== req.auth.userId && req.auth.isAdmin !== true) {/*ID utilisateur de la demande, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur et également si l'user et admin*/
        return res.status(401).json({ error: "Unauthorized request" });
      } else {
        if(req.file){ /*si fichier image  existe dans cas là*/
        let filenam = postDelete.image.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. //
        fs.unlink(`images/${filenam}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. //
        })
      }
        // Create a Tutorial
        db.posts.destroy({                         //Ensuite, nous détruisent le commentaire et envoyons à la base de donnée//
         where: { id: id },include: [db.comments]//Ensuite, incluions les comments //
        });
        db.comments.destroy({                 /* et nous détruisent les comments ou le postId et le même que le post supprimer*/
          where: { postId: id },
       });
        res.send({
          message: "POST was Delete successfully."
        });
      }
    });
}
  ;