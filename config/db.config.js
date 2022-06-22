require('dotenv').config(); /*configuration de ma base de donné mysql */
const passwordDB = process.env.Secret_PASSWORD;
const secretDB = process.env.SECRET_DB;
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: passwordDB,
    DB: secretDB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };



  