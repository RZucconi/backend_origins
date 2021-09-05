const express = require('express')
const models = require('../../models')
const router = new express.Router()


// CREATE
router.post('/video', async (req, res) => {
  const video = models.Video.build(req.body)

  try {
    await video.save()
    res.status(201).send(video)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})


// READ
// GET /videos?limit=10&offset=0 -> pagination
router.get('/videos', async (req, res) => {
  const { limit, offset } = req.query
  try {
  const videos = await models.Video.findAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{
      model: models.Tag,
      as: 'tags'
    }]
  }
  )
    
    if(!videos) {
      res.sendStatus(404)
    }

    res.send(videos)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.get('/video/:id', async (req, res) => {
  const id = req.params.id

  try{
    const video = await models.Video.findByPk(id, {
      order: [["createdAt", "DESC"]],
      include: [{
        model: models.Tag,
        as: 'tags'
      }]
    })
    
    if(video.length === 0) {
      res.sendStatus(404)
    }

    res.send(video)
  } catch (err) {
    res.status(400).send()
  }
})

// UPDATE
router.patch('/video/:id', async (req, res) => {
  const id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['nom', 'description', 'url']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const video = await models.Video.findByPk(id)
  
  // Check if modifications are valid
  if (!isValidOperation) {
    return res.status(400).send({ error : 'invalid updates!' })
  }

  // Check if video already exist
  if (video.length === 0) {
    res.sendStatus(404)
  }

  try {
    await models.Video.update(req.body, {
      where: {
        id
      }
    })

    res.send(await models.Video.findByPk(id))
  } catch (err) {
    res.status(400).send(err)
  }
})


// Ajout d'un tag a une vidéo
const addTag = (req, res) => {
  return models.Video
  .findByPk(req.body.video_id)
  .then((video) => {
    if(!video) {
      return res.status(404).send({
        message: 'Video Not Found'
      })
    }
    models.Tag.findByPk(req.body.tag_id).then((tag) => {
      if(!tag) {
        return res.status(404).send({
          message: 'Tag Not Found'
        })
      }
      video.addTag(tag)
      return res.status(200).send(video)
    })
  })
  .catch((err) => res.status(400).send(err))
}

router.put('/video/add_tag', addTag)

//DELETE
router.delete('/video/:id', async (req, res) => {
  const id = req.params.id
  const video = await models.Video.findByPk(id)

  // Check if video already exist
  if (video.length === 0) {
    res.sendStatus(404)
  }

  try {
    await models.Video.destroy({
      where: {
        id
      }
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = {
  router,
  addTag
}