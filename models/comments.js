'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here

        models.Comment.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
        models.Comment.belongsTo(models.Message, {
          foreignKey: {
            allowNull: false
          }
        })
        models.Comment.hasMany(models.Message, {
          foreignKey: {
            allowNull: false
          }
        })
        models.Comment.hasMany(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Comment;
};