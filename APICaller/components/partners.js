const axios = require('axios')
const { baseApiUrl, port } = require('../.env')
const { exists } = require('./validation')

const getPartners = () => {
    return axios.get(`${baseApiUrl}/partners`)
        .then(res => res.data)
}

const getContracts = () => {
    return axios.get(`${baseApiUrl}/partnership`)
        .then(res => res.data)
}

const insertPartners = (partner) => {
    return axios.post(`${baseApiUrl}/partners`, partner)
        .catch(err => `Erro Inserir Parceiros ${err.response.status} - ${err.response.statusText} - ${err.response.config.data} - ${err.response.data.originalError}`)
}

const seedPartners = () => {
    Promise.all([getContracts(), getPartners()])
        .then(resultado => {
            console.log('seed Partners')
            const [contract, partners] = [resultado[0], resultado[1]]
            if (exists(contract)) { // Se banco populado
                partners.forEach(async partner => {
                    if (new Date(partner.created_at) > new Date(contract[0].LastDate) ||
                        new Date(partner.updated_at) > new Date(contract[0].LastDate)) {
                        await insertPartners(partner).catch(err => console.log(err))
                    }
                })
            } else { // Não possui contratos, banco zerado
                partners.forEach(async partner => {
                    await insertPartners(partner)
                        .catch(err => console.log(err))
                })
            }
        })
        .catch(err => console.log(`seedPartners Error ${err.response.status} ${err.response.statusText} - ${err.response.data.name}: ${err.response.data.originalError.message}`))
}



module.exports = { seedPartners }