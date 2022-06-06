// Import d'express et des autres packs//
var auth = require('../middleware/auth');
const {param} = require('../app');
const express = require('express');//Récupération du framework express//
const router = express.Router();// //Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations
const dov = require('dotenv').config();//Récupération du package dotenv qui stocke des donnés sensible dans des variables d'environnements//

const userModifyDelete = require('../controllers/modifyDeleteUser.controller');//Récupération  contrôleurs contenant le code d'implémentation pour l'user//
router.get("/:id/", auth, userModifyDelete.findOneUser);
router.put("/:id/modify",  auth, userModifyDelete.modify);
router.delete("/:id/delete", auth, userModifyDelete.delete);

module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//