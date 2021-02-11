const { idCompany } = require('../.env')
const { timeZone } = require('../.env')
const { timeFormat } = require('../.env')

module.exports = app => {

    const { validatePartner } = app.api.validation

    const get = (req, res) => {
        app.dbSource('TI_VW_SYSTEM_SIG_IMPORT_PARTNERS')
            .then(partners => res.json(partners))
            .catch(err => res.status(500).send(err))
    }

    const save = async (req, res) => {
        const partner = { ...req.body }

        if (!partner.id_company) partner.id_company = idCompany

        const validator = validatePartner(partner)

        if (validator.status) {
            return res.status(validator.status).send(validator.message)
        }

        const partnerFromDB = await app.dbSink('partners')
            .where({ cpf_cnpj: partner.cpf_cnpj }).first()

        const city = await app.dbSink('cities')
            .select('id_city')
            .where({ ibge_code: partner.ibge_code }).first()

        partner.id_city = city.id_city

        delete partner.ibge_code

        if (partnerFromDB) {
            partner.updated_by = 'API'
            partner.updated_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            const partnerContractFromDB = await app.dbSink('partners_contracts')
                .where({ cpf_cnpj: partner.cpf_cnpj }).first()

            if (partnerContractFromDB) {
                app.dbSink('partners_contracts')
                    .update(partner)
                    .where({ cpf_cnpj: partner.cpf_cnpj })
                    .then(_ => { res.status(204).send() })
                    .catch(err => res.status(500).send(err))
            } else {
                app.dbSink('partners_contracts')
                    .insert(partner)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }


        } else {
            partner.created_by = 'API'

            if (!partner.created_at) partner.created_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            app.dbSink('partners')
                .insert({
                    cpf_cnpj: partner.cpf_cnpj,
                    created_by: 'API',
                    created_at: new Date().toLocaleString(timeFormat, { timeZone: timeZone })
                })
                .catch(err => {
                    console.log(`${err.originalError.info.name} server ${err.originalError.info.serverName} : ${err.originalError.info.message}`)
                })

            app.dbSink('partners_contracts')
                .insert(partner)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    return { get, save }
}