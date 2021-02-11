const config = require('../knexfiles/knexSource.js')
const knex = require('knex')(config)

module.exports = knex