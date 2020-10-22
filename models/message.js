'use strict';
module.exports = (sequelize, DataTypes) => {
  let Message = sequelize.define('Message', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING,
  }, {});
  Message.associate = function (models) {
    // associations can be defined here
   // models.Message.hasMany(models.Comment, { onDelete: 'cascade' })
   
  };
  return Message;
};