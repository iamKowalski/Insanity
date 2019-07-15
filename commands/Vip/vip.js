const { Command, InsanityEmbed } = require('../../utils')

module.exports = class Vip extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['premium']
        this.examples = [
            `<user>`
        ]
        this.subcommandsOnly = true
        this.adminOnly
    }
}