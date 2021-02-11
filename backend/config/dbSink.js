const config = require('../knexfiles/knexSink.js')
const knex = require('knex')(config)

module.exports = knex