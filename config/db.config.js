require('dotenv').config(); /*configuration de ma base de donné mysql */
const baseDB = process.env.Secret_DB;
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: baseDB,
    DB: "groupomania",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };



  