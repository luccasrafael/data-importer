const axios = require('axios')
const { baseApiUrl } = require('../.env')
const { exists } = require('./validation')

const getDrivers = () => {
    return axios.get(`${baseApiUrl}/drivers`)
        .then(res => res.data)
}

const insertDriver = (driver) => {
    return axios.post(`${baseApiUrl}/drivers`, driver)
        .catch(err => console.log(err))
}

const getContracts = () => {
    return axios.get(`${baseApiUrl}/contracts`)
        .then(res => res.data)
}

const seedDrivers = () => {
    Promise.all([getContracts(), getDrivers()])
        .then(resultado => {
            console.log('seed Drivers')
            const [contracts, drivers] = [resultado[0], resultado[1]]
            if (exists(contracts)) { // Se banco populado
                drivers.forEach(async driver => {
                    if (new Date(driver.created_at) > new Date(contracts[0].LastDate) ||
                        new Date(driver.updated_at) > new Date(contracts[0].LastDate)) {
                        await insertDriver(driver).catch(err => console.log(err))
                    }
                })
            } else { // Não possui contratos, banco zerado 
                drivers.forEach(async driver => {
                    await insertDriver(driver).catch(err => console.log(err))
                })
            }
        })
        .catch(err => console.log(`seedDrivers Error ${err.response.status} ${err.response.statusText} - ${err.response.data.name}: ${err.response.data.originalError.message}`))
}

module.exports = { seedDrivers }