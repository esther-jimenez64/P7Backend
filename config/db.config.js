require('dotenv').config(); 
const baseDB = process.env.Secret_DB;
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: baseDB,
    DB: "p7",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };



  