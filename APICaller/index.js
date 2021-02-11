const schedule = require('node-schedule')
const { seedDrivers } = require('./components/drivers')
const { seedPartners } = require('./components/partners')
const { seedDocuments } = require('./components/documents')

const delay = ms => new Promise(res => setTimeout(res, ms));

// TODO
// melhorar essa parte de forma a não utilizar delay e usar promises
const seedAll = async () => {
    const dataInicio = new Date()
    console.log(`Processo iniciado em ${dataInicio}`)
    seedDrivers()
    
    await delay(300000)
    // console.log("Aguardando 300s para evitar errors")
    
    seedPartners()
    
    await delay(300000)
    // console.log("Aguardando 300s para evitar errors")
    
    seedDocuments()
}

//https://crontab.guru/examples.html
schedule.scheduleJob('0 * * * *', () => {
    seedAll()
})

seedAll()