require('dotenv').config()

const InsanityBot = require('./Insanity.js')
const client = new InsanityBot()
client.login()
.then(() => {
    console.log(`Logado no Discord!`)
})
.catch(err => {
    console.error(`Erro ao fazer login no Discord\n${err.message}`)
})