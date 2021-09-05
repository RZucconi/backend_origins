const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../src/app')

chai.use(chaiHttp)

describe('/Tag Test Collection' , () => {
 
  it('should verify that we have 0 tag in the DB', (done) => {

    chai.request(server)
    .get('/tags')
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.a('array')
      expect(res.body.length).to.be.equal(0)
      done()
    })
  })

  
  it('should POST a valid tag', (done) => {

    let tag = {
      valeur : "Test tag 01"
    }

    chai.request(server)
    .post('/tag')
    .send(tag)
    .end((err, res) => {
      res.should.have.status(201)
      res.body.should.a('object')
      res.body.valeur.should.be.equal('Test tag 01')
      done()
    })
  })

  it('should verify that we have 1 tag in the DB', (done) => {

    chai.request(server)
    .get('/tags')
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.a('array')
      expect(res.body.length).to.be.equal(1)
      done()
    })
  })

  it('should DELETE a tag', (done) => {

    chai.request(server)
    .delete('/tag/1')
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })

})