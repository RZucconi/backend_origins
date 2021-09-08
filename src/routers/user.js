const express = require('express')
const { TokenExpiredError } = require('jsonwebtoken')
const models = require('../../models')
const router = new express.Router()
const auth = require('../middleware/auth') 
const bcrypt = require('bcrypt')
const sequelize = require('sequelize')

const { findByCredentials, generateAuthToken } = require('./tools')

// CREATE
router.post('/user', async (req, res) => {
  try {
    const newUser = await models.User.build(req.body)
    await newUser.save()
    res.status(201).send(newUser)
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
    .catch ((err) => res.send(err.message))
})

// Ajout d'une video dans une table favoris
router.post('/user/add_favorite', auth, async (req, res) => {
  const alreadyExist = await models.Favorite.findOne({
    where: {
      video_id: req.body.video_id,
      user_id: req.user.dataValues.id
    }
  })

  if (alreadyExist) {
    return res.status(403).send({message: 'A favorite of this video already exist for this user.'})
  }

  await models.Favorite
  .create({
    video_id: req.body.video_id,
    user_id: req.user.dataValues.id
  })
  .then((favorite) => {
    res.send({favorite})
  })
  .catch ((err) => {
    res.send(err.message)
  })
})

// READ
router.get('/users/me', auth, (req, res) => {
  res.send(req.user)
})

router.get('/users/me/favorite', auth, async (req, res) => {
  const Op = sequelize.Op
  try {
    const favorites = await models.Favorite.findAll({where: {
      user_id: req.user.dataValues.id
    }})
    if (favorites.length === 0) {
      return res.status(404).send({message: 'No Favorite Video Found'})
    }
    const videoIds = new Array() 
    favorites.filter((favorite) => favorite.dataValues ? videoIds.push({ id: favorite.dataValues.video_id }) : '')
    
    const results = await models.Video.findAll({
      where: {
        [Op.or]: videoIds
      },
      include: [{
        model: models.Tag,
        as: 'tags'
      }]
    })
    res.status(200).send(results)
  } catch (err) {
    return res.status(400).send(err.message)
  }
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
    .catch ((err) => {
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

module.exports = router