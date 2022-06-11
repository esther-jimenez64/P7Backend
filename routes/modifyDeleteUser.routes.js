var auth = require('../middleware/auth');/*Récupération du middleware d'authentification*/
const express = require('express');//Récupération du framework express//
const router = express.Router();/*Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations*/
const dov = require('dotenv').config();//Récupération du package dotenv qui stocke des donnés sensible dans des variables d'environnements//

const userModifyDelete = require('../controllers/modifyDeleteUser.controller');//Récupération  contrôleurs contenant le code d'implémentation pour l'user//
router.get("/:id/", auth, userModifyDelete.findOneUser);//route get pour récupérer un user avec son contrôleur //
router.put("/:id/modify",  auth, userModifyDelete.modify);//route put pour modifier un user avec son contrôleur //
router.delete("/:id/delete", auth, userModifyDelete.delete);//route delete pour supprimé un user avec son contrôleur//

module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//