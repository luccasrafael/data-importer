const axios = require('axios')
const { baseApiUrl } = require('../.env')
const { exists } = require('./validation')

const getDocuments = () => {
    return axios.get(`${baseApiUrl}/documents`)
        .then(res => res.data)
}

const getDocumentUpdates = () => {
    return axios.get(`${baseApiUrl}/date/document`)
        .then(res => res.data)
}

const insertDocuments = (document) => {
    return axios.post(`${baseApiUrl}/documents`, document)
    .catch(err => console.log(`seedDocuments Error ${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`))
}

const seedDocuments = () => {
    Promise.all([getDocuments(), getDocumentUpdates()])
        .then(resultado => {
            console.log('seed Documents')
            const [documents, lastDocument] = [resultado[0], resultado[1]]
            if (exists(lastDocument)) { //Se banco populado
                documents.forEach(async document => {
                    if (new Date(document.created_at) > new Date(lastDocument[0].LastDate) ||
                        new Date(document.updated_at) > new Date(lastDocument[0].LastDate)) {
                        await insertDocuments(document).catch(err => console.log(err))
                    }
                })
            } else {
                documents.forEach(async document => {
                    await insertDocuments(document).catch(err => console.log(err))
                })
            }
        })
        .catch(err => console.log(`seedDocuments Error ${err.response.status} ${err.response.statusText} - ${err.response.data.name}: ${err.response.data.originalError.message}`))
}

module.exports = { seedDocuments }