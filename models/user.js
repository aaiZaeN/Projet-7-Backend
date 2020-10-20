'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});

  User.associate = function (models) {
    // associations can be defined here
    models.User.hasMany(models.Groupopost)
    models.User.hasMany(models.Comment)
  };

  return User;
};