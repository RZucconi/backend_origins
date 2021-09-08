const jwt = require('jsonwebtoken')
const models = require('../../models')

const auth = async (req, res, next) => {
  try {
    const headerToken = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(headerToken, process.env.JWT_SECRET)
    const user = await models.User.findOne({where: { id: decoded.id }})
    const token = await models.Token.findOne({where: { token: headerToken }})
    
    if (!token) {
      throw new Error()
    }

    req.user = user
    req.token = headerToken
    next()
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = auth