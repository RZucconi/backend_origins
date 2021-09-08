const express = require('express')
const { TokenExpiredError } = require('jsonwebtoken')
const models = require('../../models')
const router = new express.Router()
const auth = require('../middleware/auth') 
const bcrypt = require('bcrypt')

const { findByCredentials, generateAuthToken } = require('./tools')

// CREATE
router.post('/user', async (req, res) => {
  try {
    const user = await models.User.build(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

router.post('/user/login', async (req, res) => {
  const { pseudo, password } = req.body
    const user = await findByCredentials(pseudo, password)
    const newToken = await generateAuthToken(user)
    await models.Token
    .create({
      token: newToken,
      user_id: user.id
    })
    .then((token) => {
      res.send({user, token})
    })
    .catch((err) => res.send(err.message))
})

// READ
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// UPDATE
router.patch('/user/me', auth, async (req, res) => {
  const { id } = req.user.dataValues
  const updates = Object.keys(req.body)
  const allowedUpdates = ['pseudo', 'password']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const user = await models.User.findByPk(id)

  // Check if modifications are valid
  if (!isValidOperation) {
    return res.status(400).send({ error : 'invalid updates!' })
  }

  try {
    await bcrypt.hash(req.body.password, 8)
    .then(hash => {
      req.body.password = hash
    })
    .catch((err) => {
      throw new Error()
    })
    await models.User.update(req.body, {
      where: {
        id
      }
    })

    res.send(await models.User.findByPk(id))
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// DELETE

//LOGOUT
router.delete('/user/logout', auth, async (req, res) => {
  try {
    await models.Token.destroy({
      where: {
        token: req.token
      }
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// LOGOUT ALL DEVICES
router.delete('/user/logoutAll', auth, async (req, res) => {
  try {
    await models.Token.destroy({
      where: {
        user_id: req.user.dataValues.id
      }
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

router.delete('/user/me/delete', auth, async (req, res) => {
  const id = req.user.dataValues.id
  const user = await models.User.findByPk(id)
  if (user.length === 0) {
    res.sendStatus(404)
  }

  try {
    await models.User.destroy({
      where: {
        id
      }
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

module.exports = router