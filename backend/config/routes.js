module.exports = app => {
    app.route('/')
        .get((req, res) => {
            res.send('Resposta de acesso a Raiz')
        })

    app.route('/pivato')
        .get(app.api.source.get)

            // app.route('/test/:date')
            // .get(app.api.source.test)

    app.route('/contracts')
        .get(app.api.sink.getDateLastContract)

    app.route('/drivers')
        .post(app.api.drivers.save)
        .get(app.api.drivers.get)

    app.route('/partners')
        .get(app.api.partners.get)
        .post(app.api.partners.save)

    app.route('/partnership')
        .get(app.api.sink.getDateLastPartnership)

    app.route('/documents')
        .get(app.api.documents.get)
        .post(app.api.documents.save)

    app.route('/date/document')
        .get(app.api.sink.getDateLastDocument)
}