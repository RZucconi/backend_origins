const models = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const findByCredentials = async (pseudo, password) => {
  const user = await models.User.findOne({ where: { pseudo } })
  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.dataValues.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }
  
  return user
}

const generateAuthToken = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
  return token
}


module.exports = {
  findByCredentials,
  generateAuthToken
}