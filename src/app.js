const express = require('express')
require('./db/sequelize')
const videoRouter = require('./routers/video').router
const tagRouter = require('./routers/tag')
const welcomeRouter = require('./routers/welcome')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(videoRouter)
app.use(tagRouter)
app.use(welcomeRouter)
app.use(userRouter)

module.exports = app