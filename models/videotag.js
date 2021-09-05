'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  VideoTag.init({
    video_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VideoTag',
  });
  return VideoTag;
};