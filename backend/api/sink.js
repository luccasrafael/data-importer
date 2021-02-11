const { idCompany } = require('../.env')
module.exports = app => {
    const getDateLastContract = (req, res) => {
        app.dbSink('contracts')
            .select(app.dbSink.raw('(SELECT Max(v) FROM (VALUES (created_at), (updated_at)) AS value(v)) as [LastDate]'))
            .where({ id_company: idCompany })
            .orderBy('LastDate', 'desc')
            .limit(1)
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err))
    }

    const getDateLastPartnership = (req, res) => {
        app.dbSink('partners_contracts')
            .select(app.dbSink.raw('(SELECT Max(v) FROM (VALUES (created_at), (updated_at)) AS value(v)) as [LastDate]'))
            .where({ id_company: idCompany })
            .orderBy('LastDate', 'desc')
            .limit(1)
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err))
    }

    const getDateLastDocument = (req, res) => {
        app.dbSink('documents')
        .select(app.dbSink.raw('(SELECT Max(v) FROM (VALUES (created_at), (updated_at)) AS value(v)) as [LastDate]'))
            .where({ id_company: idCompany })
            .orderBy('LastDate', 'desc')
            .limit(1)
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err))
    }

    return { getDateLastContract, getDateLastPartnership, getDateLastDocument }
}