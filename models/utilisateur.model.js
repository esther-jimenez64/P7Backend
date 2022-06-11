//modelqui représente une table dans votre base de données//
'use strict';
const {
  Model
} = require('sequelize'); 
module.exports = (sequelize, DataTypes) => {
  class User extends Model {              /*pour définir le modèles, une méthode de class*/
    static associate(models) {            //Ajout une static associate() fonction qui étend la Modelclasse/  
      //la associate()méthode appellera la hasMany()fonction d'association, qui ajoutera la clé primaire du Usermodèle au Taskmodèle.// 
      User.hasMany(models.Post, { //association signifie qu'une relation un à plusieurs existe entre users et post, la clé étrangère étant définie dans le modèle cible //
        foreignKey: 'userId',
      }),
      User.hasMany(models.Comment, {//association signifie qu'une relation un à plusieurs existe entre user et comment, la clé étrangère étant définie dans le modèle cible //
        foreignKey: 'userId',
      })
    }
  };
  User.init({  //inisalitation et contenue de mon class modèle//
    email: DataTypes.STRING,  //type chaine de carctère/*/
    username: DataTypes.STRING,//type chaine de carctère/*/
    password: DataTypes.STRING,//type chaine de carctère/*/
    isAdmin: DataTypes.BOOLEAN,//type chaine de carctère/*/
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};