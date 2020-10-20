'use strict';
module.exports = (sequelize, DataTypes) => {
  let Comment = sequelize.define('Comment', {
    idUSERS: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING, 
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        models.Comment.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
        models.Comment.belongsTo(models.Groupopost, {
          foreignKey: {
            allowNull: false
          }
        })
        models.Comment.hasMany(models,Groupopost, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Comment;
}