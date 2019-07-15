const { Command, InsanityEmbed, MentionUtils, VipUtils } = require('../../utils')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = class VipRemove extends Command {
    constructor(name, client) {
        super(name, client)
        this.aliases = ['remover']
        this.argsRequired = true
        this.invalidArgsMessage = 'Informe um usuário para prosseguir!'
        this.description = 'Remove um usuário no cargo vip'
    }

    async run(message, args) {
        var [user] = args
        const embed = new InsanityEmbed(message.author)
        const codeblock = (arg) => `\`\`\`${arg}\`\`\``

        user = MentionUtils.User(this.client, message.guild, user)

        const { vipRole } = await this.client.database.users.get(message.author.id)
        const { vipUser } = await this.client.database.users.get(user.id)

        if (!user) return message.channel.send(embed.setDescription(`Você precisa fornecer um usuário válido para configurar!`))

        if (!vipRole) return message.channel.send(embed.setDescription(`Você precisa de um cargo configurado como vip neste servidor!`))
        if (vipUser !== message.author.id) return message.channel.send(`**${user.username}** não pertence ao seu vip!`)
        const role = message.guild.roles.get(vipRole)
        if (!role) return message.channel.send(embed.setDescription(`Acho que seu cargo foi apagado :(`))

        const msg = await message.channel.send(embed.setDescription(
            `**${message.author.username}**, você está prestes a remover o seu cargo Vip(${role}) no usuário \`${user.username}\`\n${codeblock('"✅" => Confirma\n"❌" => Cancela')}`
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
                member.roles.some(r => r.id === role.id) ? member.removeRole(role) : null
                try {
                    VipUtils.removeUser(this.client, message.author.id, user.id)
                    message.channel.send(embed.setDescription(`✅ Seu cargo vip(${role}) foi removido de \`${user.username}\`!`))
                } catch (err) {
                    switch (err.message) {
                        case 'NOT_VIP':
                            message.channel.send(embed.setDescription(`❌ **${user.username}** não está em nenhum cargo vip!`))
                            break;
                        case 'NOT_ROLE':
                            message.channel.send(embed.setDescription('❌ **Cargo não encontrado!**'))
                            break;
                        default:
                            message.channel.send(embed.setDescription(`❌ Ocorreu um erro ao tentar remover o usuário \`${user.username}\` em seu cargo vip!`))
                    }
                }
            } else {
                message.channel.send(embed.setDescription(`❌ Configuração cancelada!`))
            }
        })
    }
}