const { RichEmbed } = require('discord.js')

module.exports = class InsanityEmbed extends RichEmbed {
    constructor(user, data = {}) {
        super(data)
        this.setColor(process.env.EMBED_COLOR).setTimestamp()
        if (user) this.setFooter(`Comando executado por ${user.tag}`, user.displayAvatarURL)
    }

    setDescriptionFromBlockArray(blocks) {
        this.description = blocks.map(lines => lines.filter(l => !!l).join('\n')).filter(b => !!b.length).join('\n\n')
        return this
    }
}