const sequelize = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
 let Groupopost = sequelize.define('Groupopost', {
   idUSERS: DataTypes.INTEGER,
   title: DataTypes.STRING,
   content: DataTypes.STRING,
   attachment: DataTypes.STRING,
   likes: DataTypes.INTEGER
 }, {
   classMethods: {
     associate: function(models) {
       // associations can be defined here

       models.Groupopost.belongsTo(models.User, {
         foreignKey: {
           allowfull: false
         }
       })
     }
   }
 });
 return Groupopost;
};