const { Sequelize } = require('sequelize')
const { DB_HOST, DB_NAME } = process.env

try {
  const sequelize = new Sequelize(DB_HOST + DB_NAME)
  console.log(`Successfully connected to Postgresql ${DB_NAME} database!`)
} catch (err) {
  console.log('Postgresql database connection failure:', err)
}
