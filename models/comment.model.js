//model qui représente une table dans votre base de données//
'use strict';
const {
  Model
} = require('sequelize');  //définir ce modèle sont présentées ci-dessous//
module.exports = (sequelize, DataTypes) => {  
  class Comment extends Model {  //pour définir le modèles, une méthode de class //

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