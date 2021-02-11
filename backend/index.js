const port = 3000
const app = require('express')()
const consign = require('consign')
const dbSource = require('./config/dbSource')
const dbSink = require('./config/dbSink')

app.dbSource = dbSource
app.dbSink = dbSink

consign()
    .include('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => {
    console.log(`Backend da api executando na porta ${port}`)
})