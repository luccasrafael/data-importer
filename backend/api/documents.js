const { idCompany } = require('../.env')
const { timeZone } = require('../.env')
const { timeFormat } = require('../.env')
const fs = require('fs')

module.exports = app => {

    const { validateDocument } = app.api.validation

    const get = (req, res) => {
        app.dbSource('TI_VW_SYSTEM_SIG_IMPORT_DOCUMENTS')
            .then(documents => res.json(documents))
            .catch(err => res.status(500).send(err))

    }

    const save = async (req, res) => {

        const document = { ...req.body }

        if (!document.id_company) document.id_company = idCompany

        const documentFromDB = await app.dbSink('documents')
            .where({ traveling_number: document.traveling_number, id_company: idCompany, cpf: document.cpf })
            .first()

        if (document.status == 'Inutilizado') {
            if (documentFromDB) {
                app.dbSink('documents')
                    .where({ id_document: documentFromDB.id_document })
                    .del()
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                res.status(204).send()
            }
            return null
        }
        
        const validator = validateDocument(document)

        if (validator.status) {
            return res.status(validator.status).send(validator.message)
        }

        if (documentFromDB) {
            document.updated_by = 'API'
            document.updated_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            app.dbSink('documents')
                .update(document)
                .where({ traveling_number: document.traveling_number, percentage: document.percentage })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            document.created_by = 'API'

            if (!document.created_at) document.created_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            app.dbSink('documents')
                .insert(document)
                .then(_ => res.status(204).send())
                .catch(err => {

                    let erro = `${err.originalError.info.name} server ${err.originalError.info.serverName} : ${err.originalError.info.message}`
                    console.log(erro)

                    fs.appendFile('../message_error_document.json', JSON.stringify(document) + erro, function (err) {
                        if (err) throw err;
                    });
                    res.end()

                })
        }
    }
    return { get, save }
}