//model qui représente une table dans votre base de données//
'use strict';
const {
  Model
} = require('sequelize'); 
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {        //pour définir le modèles, une méthode de class //
    static associate(models) {     //Ajout une static associate() fonction qui étend la Modelclasse/  
      Post.belongsTo(models.User, {  /*Association une relation un-à-un existe entre posts et users*/
        foreignKey: 'userId',        /* la clé étrangère étant définie avec  foreignKey  */
        onDelete: 'CASCADE'          /*Supprimassions en cascade si on supprime l'user  qui la crée*/
      }),
      Post.hasMany(models.Comment, {  //association signifie qu'une relation un à plusieurs existe entre post et comment, la clé étrangère étant définie dans le modèle cible //
        foreignKey: 'postId',
      })
    }
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