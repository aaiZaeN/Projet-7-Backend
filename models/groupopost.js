'use strict';
module.exports = (sequelize, DataTypes) => {
  let Groupopost = sequelize.define('Groupopost', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {});
  Groupopost.associate = function (models) {
    // associations can be defined here
    models.Groupopost.hasMany(models.Comment, { onDelete: 'cascade' })
    models.Groupopost.hasMany(models.Like, { onDelete: 'cascade' })
  };
  return Groupopost;
};