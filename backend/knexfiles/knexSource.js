const { dbSource } = require('../.env')

module.exports = {

    client: 'mssql',
    connection: dbSource,
    pool: {
        min: 2, 
        max: 10
    }
};