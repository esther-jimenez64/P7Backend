const dbConfig = require("../config/db.config");/*Récupération de la configuration base de donnée*/
const path = require('path');/*Récupération module Path qui permet de travailler avec des répertoires et des chemins de fichiers*/
const Sequelize = require("sequelize");/*Récupération de l'outils ORM pour une prise en charge transactions, des relations,DB mysql */
const fs = require('fs');//Récupération du module fs fournit de nombreuses fonctionnalités comme fs.unlink pour supprimer des fichiers//
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, { /*Configuration de l'instance  sequelize qui représente une connexion à une base de données*/
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: { //regarde si il n'y a pas déjà une connexion existante avec cet hôte//
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize; /*/Sequelize fait référence à la bibliothèque elle-même*/
db.sequelize = sequelize; //*sequelize fait référence à une instance de Sequelize, qui représente une connexion à une base de données//
db.users = require("./utilisateur.model.js")(sequelize, Sequelize);  /*récuperation du model users*/
db.posts = require("./post.model")(sequelize, Sequelize);             /*récuperation du model posts*/
db.comments = require("./comment.model")(sequelize, Sequelize);        /*récuperation du model commments*/
const POST = db.posts;
/*** Assosation  ***/
db.users.hasMany(db.posts, { /*association une relation un-à-un existe entre users et posts, la clé étrangère étant définie avec */
  foreignKey: 'userId',      /* foreignKey dans le modèle cible */
}),
db.users.hasMany(db.comments, { /*associatio une relation un-à-un existe entre users et commments*/
foreignKey: 'userId',           /* la clé étrangère étant définie avec  foreignKey dans le modèle cible */
})
db.posts.belongsTo(db.users, {  /*association une relation un-à-un existe entre posts et users*/
  foreignKey: 'userId',         /* la clé étrangère étant définie avec  foreignKey dans le modèle source */
  onDelete: 'CASCADE'           /*configurer les comportements ON DELETE cascade pour suprimer les posts créer par l'user delete*/
}),
db.posts.hasMany(db.comments, {  /*association une relation un-à-un existe entre posts et comments*/ 
  foreignKey: 'postId',          /* la clé étrangère étant définie avec  foreignKey dans le modèle cible */
  onDelete: 'CASCADE'            /*configurer les comportements ON DELETE cascade pour suprimer les comments du posts delete*/
})
db.comments.belongsTo(db.users, {  /*association une relation un-à-un existe entre comments et users*/
  foreignKey: 'userId',            /* la clé étrangère étant définie avec  foreignKey dans le modèle source */
  onDelete: 'CASCADE'              /*configurer les comportements ON DELETE cascade pour suprimer les comments créer par l'user delete*/
})

db.comments.belongsTo(db.posts, {   /*association une relation un-à-un existe entre comments et posts*/
  foreignKey: 'postId',             /* la clé étrangère étant définie avec  foreignKey dans le modèle source */
  onDelete: 'CASCADE'         /*configurer les comportements ON DELETE cascade pour suprimer les comments contenu dans le post delete*/
})
//Éviter de supprimé les données  à chaque connexion//
db.sequelize.sync({ force: false })
.then(() => {
  console.log('re-sync effectuée !')
})

module.exports = db;



