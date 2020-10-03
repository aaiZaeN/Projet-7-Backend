'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.hasMany(models.Groupopost);
      }
    }
  });
  return User;
};