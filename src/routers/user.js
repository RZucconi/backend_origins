const express = require('express')
const models = require('../../models')
const router = new express.Router()
const bcrypt = require('bcrypt')

router.post('/user', async (req, res) => {
  const user = models.User.build(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    console.log('ERR ::::::::', err)
    res.status(400).send()
  }
})

router.get('/users', async (req, res) => {

  try {
    const users = await models.User.findAll()
    
    if(!users) {
      res.sendStatus(404)
    }

    res.send(users)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.get('/user/login', async (req, res) => {
  let userDetails = req.body

  try {
    const user = await models.User.findOne({
      where: {
        email: userDetails.email
      }
    })
    
    let isMatch = await bcrypt.compare(userDetails.password, user.dataValues.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    console.log(isMatch)
    res.status(200).send(user)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

module.exports = router