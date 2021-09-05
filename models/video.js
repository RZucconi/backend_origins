'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Video.belongsToMany(models.Tag, {
        through: 'VideoTag',
        as: 'tags',
        foreignKey: 'video_id'
      })
    }
  };
  Video.init({
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};