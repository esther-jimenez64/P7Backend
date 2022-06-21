//modelqui représente une table dans votre base de données//
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /*pour définir le modèles, une méthode de class*/
  }
  User.init(
    {
      //inisalitation et contenue de mon class modèle//
      email: DataTypes.STRING, //type chaine de carctère/*/
      username: DataTypes.STRING, //type chaine de carctère/*/
      password: DataTypes.STRING, //type chaine de carctère/*/
      isAdmin: DataTypes.BOOLEAN, //type chaine de carctère/*/
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
