const express = require('express')
require('./db/sequelize')
const videoRouter = require('./routers/video').router
const tagRouter = require('./routers/tag')
const welcomeRouter = require('./routers/welcome')

const app = express()

app.use(express.json())
app.use(videoRouter)
app.use(tagRouter)
app.use(welcomeRouter)

module.exports = app