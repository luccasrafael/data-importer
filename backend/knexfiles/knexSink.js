const { dbSink } = require('../.env')

module.exports = {

    client: 'mssql',
    connection: dbSink,
    pool: {
        min: 2,
        max: 10
    }
};