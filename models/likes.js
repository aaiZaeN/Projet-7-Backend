'use strict';
module.exports = (sequelize, DataTypes) => {
  let Like = sequelize.define('Like', {
    groupopostId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groupopost',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    isLike: DataTypes.INTEGER
  }, {});

  Like.associate = function (models) {
    // associations between tables
    //Many to many association with a join table
    models.User.belongsToMany(models.Groupopost, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'groupopostId',
    });

    models.Groupopost.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'groupopostId',
      otherKey: 'userId',
    });

    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    models.Like.belongsTo(models.Groupopost, {
      foreignKey: 'groupopostId',
      as: 'groupopost',
    });


  };
  return Like;
};