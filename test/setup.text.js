const models = require('../models')


before((done) => {
  models.Tag.destroy({
    where: {},
    truncate: true
  })
  models.Video.destroy({
    where: {},
    truncate: true
  })
  done()
})

after((done) => {
  models.Tag.destroy({
    where: {},
    truncate: true
  })
  models.Video.destroy({
    where: {},
    truncate: true
  })
  done()
})