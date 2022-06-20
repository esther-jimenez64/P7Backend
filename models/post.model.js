//model qui représente une table dans votre base de données//
'use strict';
const {
  Model
} = require('sequelize'); 
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {        //pour définir le modèles, une méthode de class //

  };
  Post.init({//inisalitation et contenue de mon class modèle//
    userId: DataTypes.INTEGER,  //stocker des nombres entiers// 
    title: DataTypes.STRING,   //type chaine de carctère/*/
    content: DataTypes.STRING,  //type chaine de carctère/*/
    image: DataTypes.STRING,    //type chaine de carctère/*/
    username:DataTypes.STRING   //type chaine de carctère/*/
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};