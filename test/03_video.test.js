
const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../src/app')
const addTag = require('../src/routers/video').addTag
const models = require('../models/')

chai.use(chaiHttp)


describe('/Video Test Collection' , () => {

  it('should POST a valid video', (done) => {

    let video = {
      nom : "Test Video 01",
      description : "Ceci est le test video 01",
      url : "test01Url"
    }

    chai.request(server)
    .post('/video')
    .send(video)
    .end((err, res) => {
      res.should.have.status(201)
      res.body.should.a('object')
      res.body.nom.should.be.equal('Test Video 01')
      done()
    })
  })
  
  it('should verify that we have 1 video in the DB', (done) => {

    chai.request(server)
    .get('/videos')
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.a('array')
      expect(res.body.length).to.be.equal(1)
      done()
    })
  })
  
  // CREATE a tag for the next test
  it('should POST a valid tag', (done) => {

    let tag = {
      valeur : "Test tag 02"
    }

    chai.request(server)
    .post('/tag')
    .send(tag)
    .end((err, res) => {
      res.should.have.status(201)
      res.body.should.a('object')
      res.body.valeur.should.be.equal('Test tag 02')
      done()
    })
  })
  
  it('should PUT a tag to a video', (done) => {
    let videoTag = {
      video_id: 1,
      tag_id: 2
    }

    chai.request(server)
    .put('/video/add_tag', addTag)
    .send(videoTag)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done()
    })
  })
  
  it('should Get a video by is id', (done) => {

    chai.request(server)
    .get('/video/1')
    .end((err, res) => {
      console.log(res.body.tags[0])
      expect(res.body.id).to.be.equal(1)
      expect(res.body.tags.length).to.be.greaterThan(0)
      done()
    })
  })

  it('should POST an invalid video', (done) => {

    let video = {
      description : "Ceci est le test video 01",
      url : "test01Url"
    }

    chai.request(server)
    .post('/video')
    .send(video)
    .end((err, res) => {
      res.should.have.status(400)
      done()
    })
  })

  it('should DELETE a video', (done) => {

    chai.request(server)
    .delete('/video/1')
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('should verify that we have 0 video in the DB', (done) => {

    chai.request(server)
    .get('/videos')
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.a('array')
      expect(res.body.length).to.be.equal(0)
      done()
    })
  })

})