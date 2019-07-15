const { Command, InsanityEmbed, MentionUtils, VipUtils } = require('../../utils')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = class VipConfig extends Command {
    constructor(name, client) {
        super(name, client)
        this.aliases = ['cfg']
        this.argsRequired = true
        this.invalidArgsMessage = 'Informe um usuário para prosseguir!'
        this.adminOnly = true
        this.description = 'Configura o cargo vip de um usuário (Adm Apenas)'
    }

    async run(message, args) {
        var [user, role] = args
        const embed = new InsanityEmbed(message.author)
        const codeblock = (arg) => `\`\`\`${arg}\`\`\``

        role = MentionUtils.Role(message.guild, role)
        user = MentionUtils.User(this.client, message.guild, user)

        if (!user) return message.channel.send(embed.setDescription(`Você precisa fornecer um usuário válido para configurar!`))

        if (!role) return message.channel.send(embed.setDescription(`Você precisa fornecer um cargo válido para configurar seu vip!`))

        const msg = await message.channel.send(embed.setDescription(
            `**${message.author.username}**, você está prestes a adicionar o cargo ${role} no usuário \`${user.username}\`\n${codeblock('"✅" => Confirma\n"❌" => Cancela')}`
        ).setThumbnail(user.displayAvatarURL))

        Promise.all([
            await msg.react('✅'),
            await msg.react('❌')
        ])

        const collector = await msg.createReactionCollector((react, user) => react.emoji.name === '✅' || react.emoji.name === '❌' && user.id === message.author.id, { time: 15000, errors: ['time'] })
        collector.on('collect', async (reaction) => {
            collector.stop()
            msg.delete()
            reaction.users.filter(u => u.id != this.client.user.id).forEach(u => { reaction.remove(u) })
            embed.setThumbnail('')
            if (reaction.emoji.name === '✅') {
                const member = message.guild.member(user.id)
                member.roles.some(r => r.id === role.id) ? null : member.addRole(role)
                try {
                    VipUtils.Add(this.client, user.id, role)
                    message.channel.send(embed.setDescription(`✅ Vip de **${user.username}** definido como ${role}`))
                } catch (err) {
                    switch (err.message) {
                        case 'ALREADY':
                            message.channel.send(embed.setDescription(`❌ **${user.username}** já possui esse cargo vip!`))
                            break;
                        default:
                            message.channel.send(embed.setDescription(`❌ Ocorreu um erro ao tentar adicionar o cargo ${role} nos vips de \`${user.username}\``))
                    }
                }
            } else {
                message.channel.send(embed.setDescription(`❌ Configuração cancelada!`))
            }
        })
    }
}