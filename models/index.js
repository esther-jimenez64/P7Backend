const dbConfig = require("../config/db.config");
const path = require('path');
const Sequelize = require("sequelize");
const fs = require('fs');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});





const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./utilisateur.model.js")(sequelize, Sequelize);
db.posts = require("./post.model")(sequelize, Sequelize);
db.comments = require("./comment.model")(sequelize, Sequelize);
const POST = db.posts;


db.users.hasMany(db.posts, {
  foreignKey: 'userId',
}),
db.users.hasMany(db.comments, {
  foreignKey: 'userId',
})
db.posts.belongsTo(db.users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
}),
db.posts.hasMany(db.comments, {
  foreignKey: 'postId',
  onDelete: 'CASCADE'
})

db.comments.belongsTo(db.users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

db.comments.belongsTo(db.posts, {
  foreignKey: 'postId',
  onDelete: 'CASCADE'
})



db.sequelize.sync({ force: false })
.then(() => {
  console.log('re-sync effectuée !')
})






module.exports = db;



