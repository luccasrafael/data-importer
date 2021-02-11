module.exports = app => {
    const get = (req, res) => {
        app.dbSource('TI_VW_SYSTEM_SIG_IMPORT_DRIVERS')
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err))
    }

    const test = (req, res) => {
        // console.log(req.params)
        res.status(200).send(req.params)
    }

    return { get, test }
}
