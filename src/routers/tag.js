const express = require('express')
const models = require('../../models')
const router = new express.Router()


// CREATE
router.post('/tag', async (req, res) => {
  try {
    const tag = await models.Tag.build(req.body)
    await tag.save()
    res.status(201).send(tag)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// READ
// Rechercher des videos par tag
router.get('/tag/:id/videos', async (req, res) => {
  try {
    const videos = await models.Video.findAll({
      include: [{
        model: models.Tag,
        as: 'tags'
      }]
    })
    
    if (!videos) {
      res.status(404).send({ message: 'Video Not Found.' })
    }
    
    let result = new Array() 
    videos.map((video) => video.tags.filter((tag) => tag.id === parseInt(req.params.id) ? result.push(video) : ''))

    if (result[0] === undefined) {
      res.status(404).send({ message: 'No video matches.' })
    }

    res.send(result)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// DELETE
router.delete('/tag/:id', async (req, res) => {
  const id = req.params.id
  const tag = await models.Tag.findByPk(id)

  // Check if tag already exist
  if (!tag) {
    res.sendStatus(404)
  }

  try {
    await models.Tag.destroy({
      where: {
        id
      }
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err.message)
  }
})


// HORS CONSIGNES //

// READ
router.get('/tags', async (req, res) => {
  try {
  const tags = await models.Tag.findAll({
    order: [["createdAt", "DESC"]]
  })
    
    if (!tags) {
      res.status(404).send({ message: 'Tag Not Found.' })
    }

    res.send(tags)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

router.get('/tag/:id', async (req, res) => {
  const id = req.params.id

  try {
    const tag = await models.Tag.findByPk(id)

    if (!tag) {
      res.status(404).send({ message: 'Tag Not Found.' })
    }

    res.send(tag)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// UPDATE
router.patch('/tag/:id', async (req, res) => {
  const id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['valeur']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const tag = await models.Tag.findByPk(id)
  
  // Check if modifications are valid
  if (!isValidOperation) {
    return res.status(400).send({ error : 'invalid updates!' })
  }

  // Check if tag already exist
  if (!tag) {
    res.sendStatus(404)
  }

  try {
    await models.Tag.update(req.body, {
      where: {
        id
      }
    })

    res.send(await models.Tag.findByPk(id))
  } catch (err) {
    res.status(400).send(err.message)
  }
})

module.exports = router