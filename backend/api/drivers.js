const { idCompany } = require('../.env')
const { timeZone } = require('../.env')
const { timeFormat } = require('../.env')

module.exports = app => {

    const { validateDriver } = app.api.validation

    const get = (req, res) => {
        app.dbSource('TI_VW_SYSTEM_SIG_IMPORT_DRIVERS')
            .then(drivers => res.json(drivers))
            .catch(err => res.status(500).send(err))
    }

    const save = async (req, res) => {
        const driver = { ...req.body }

        if (!driver.id_company) driver.id_company = idCompany

        const validator = validateDriver(driver)

        if(validator.status) {
            return res.status(validator.status).send(validator.message)
        }

        const driverFromDB = await app.dbSink('drivers')
            .where({ cpf: driver.cpf }).first()

        const city = await app.dbSink('cities')
            .select('id_city')
            .where({ ibge_code: driver.ibge_code }).first()

        driver.id_city = city.id_city

        delete driver.ibge_code
        delete driver.insert_date

        if (driverFromDB) {
            driver.updated_by = 'API'
            driver.updated_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            app.dbSink('contracts')
                .update(driver)
                .where({ cpf: driver.cpf })
                .then(_ => { res.status(204).send() })
                .catch(err => res.status(500).send(err))
        } else {
            driver.created_by = 'API'

            if (!driver.created_at) driver.created_at = new Date().toLocaleString(timeFormat, { timeZone: timeZone })

            app.dbSink('drivers')
                .insert({
                    cpf: driver.cpf,
                    created_by: 'API',
                    created_at: new Date().toLocaleString(timeFormat, { timeZone: timeZone })
                })
                .catch(err => {
                    console.log(`${err.originalError.info.name} server ${err.originalError.info.serverName} : ${err.originalError.info.message}`)
                })

            app.dbSink('contracts')
                .insert(driver)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    return { get, save }
}