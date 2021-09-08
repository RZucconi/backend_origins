'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Token, {
        foreignKey: 'user_id',
        as: 'tokens'
      })

      User.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites'
      })
    }
  };
  User.init({
    pseudo: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 8)
      .then(hash => {
        user.password = hash
      })
      .catch ((err) => {
        throw new Error()
      })
  })
  return User;
};