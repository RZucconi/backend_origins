const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../src/app')

chai.use(chaiHttp)

describe('/Welcome Test Collection' , () => {

  it('test defaultAPI Welcome route...', (done) => {

    chai.request(server)
    .get('/')
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const actualVal = res.body.message
      expect(actualVal).to.be.equal('Welcome to REST API TEST TECH')
      done()
    })
  })

})