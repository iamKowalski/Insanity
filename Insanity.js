const { Client, Collection } = require('discord.js')
const Fs = require('fs')
const { MongoDB } = require('./database')

module.exports = class InsanityBot extends Client {
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()

        this.initCommands()
        this.initListeners()
        this.initSubCommands()

        this.initializeDatabase(MongoDB, { useNewUrlParser: true })
    }

    login(token) {
        if (!token) token = process.env.TOKEN
        return super.login(token)
    }

    initCommands(path = './commands') {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        const Command = require(filePath)
                        const commandName = file.replace(/.js/g, '').toLowerCase()
                        const command = new Command(commandName, this)
                        return this.commands.set(commandName, command)
                    } else if (Fs.lstatSync(filePath).isDirectory()) {
                        this.initCommands(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    }

    initSubCommands(path = './subcommands') {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        const Command = require(filePath)
                        const commandName = file.replace(/.js/g, '').toLowerCase()
                        const command = new Command(commandName, this)
                        return this.commands.get(path.split('/').pop()).subcommands.push(command)
                    } else if (Fs.lstatSync(filePath).isDirectory()) {
                        this.initSubCommands(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    }

    initListeners(path = './events') {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        let Listener = require(filePath)
                        this.on(file.replace(/.js/g, ''), Listener)
                    }

                    let stats = Fs.lstatSync(filePath)
                    if (stats.isDirectory()) {
                        this.initListeners(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    }

    initializeDatabase(DBWrapper = MongoDB, options = {}) {
        this.database = new DBWrapper(options)
        this.database.connect()
            .then(() => console.log('Banco de dados pronto!'))
            .catch(e => {
                console.error(e.message)
                this.database = null
            })
    }
}