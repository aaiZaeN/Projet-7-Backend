'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groupoposts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Groupoposts.init({
    idUSERS: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Groupoposts',
  });
  return Groupoposts;
};