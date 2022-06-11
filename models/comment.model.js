//model qui représente une table dans votre base de données//
'use strict';
const {
  Model
} = require('sequelize');  //définir ce modèle sont présentées ci-dessous//
module.exports = (sequelize, DataTypes) => {  
  class Comment extends Model {  //pour définir le modèles, une méthode de class //
    static associate(models) {//Ajout une static associate() fonction qui étend la Modelclasse/  
 //la associate()méthode appellera la hasMany()fonction d'association, qui ajoutera la clé primaire du Usermodèle au Taskmodèle.//      
      Comment.belongsTo(models.User, { /*Association une relation un-à-un existe entre comments et users*/
        foreignKey: 'userId',          /* la clé étrangère étant définie avec  foreignKey  */
        onDelete: 'CASCADE'            /*Supprimassions en cascade si on supprime l'user  qui la crée*/
      })

      Comment.belongsTo(models.Post, {   /*association une relation un-à-un existe entre comments et posts*/
        foreignKey: 'postId',            /* la clé étrangère étant définie avec  foreignKey*/
        onDelete: 'CASCADE'              /*Supprimassions en cascade si on supprime  le post ou se trouve le comment*/
      })
    }
  };
  Comment.init({   //inisalitation et contenue de mon class modèle//
    userId: DataTypes.INTEGER, //stocker des nombres entiers// 
    postId: DataTypes.INTEGER, //stocker des nombres entiers//
    content: DataTypes.STRING, //type chaine de carctère/*/
    username:DataTypes.STRING  //type chaine de carctère/*/
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};