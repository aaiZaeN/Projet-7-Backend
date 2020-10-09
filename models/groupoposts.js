const sequelize = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
 let GroupoPost = sequelize.define('GroupoPost', {
   title: DataTypes.STRING,
   content: DataTypes.STRING,
   attachment: DataTypes.STRING
 }, {
   classMethods: {
     associate: function(models) {
       // associations can be defined here

       models.GroupoPost.belongsTo(models.User, {
         foreignKey: {
           allowfull: false
         }
       })
     }
   }
 });
 return GroupoPost;
};