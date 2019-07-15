const { Command, InsanityEmbed, MentionUtils, VipUtils } = require('../../utils')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = class VipInfo extends Command {
    constructor(name, client) {
        super(name, client)
        this.aliases = ['informação']
        this.description = 'exibe informações do cargo vip definido'
    }

    async run(message, args) {
        //var [user] = args
        const embed = new InsanityEmbed(message.author)
        const codeblock = (arg) => `\`\`\`${arg}\`\`\``

        //user = MentionUtils.User(this.client, message.guild, user)

        var { vipRole, vipUser } = await this.client.database.users.get(message.author.id)

        if (!vipRole && !vipUser) return message.channel.send(embed.setDescription(`Você precisa ser dono ou participar de algum grupo vip!`))

        var obj = { role: null, user: null };

        if (vipRole && !vipUser) {
            obj['role'] = message.guild.roles.get(vipRole)
            obj['user'] = message.author
            if (!obj['role']) return message.channel.send(embed.setDescription('O cargo definido foi apagado!'))
        } else if (vipUser && !vipRole) {
            vipUser = await this.client.database.users.get(vipUser)
            obj['role'] = message.guild.roles.get(vipUser.vipRole)
            obj['user'] = this.client.users.get(vipUser._id)

            if (!obj['role']) return message.channel.send(embed.setDescription('O cargo definido foi apagado!'))
        }

        const role = obj['role']
        const user = obj['user']

        const filterS = (type) => role.members.filter(m => m.user.presence.status === type).size

        embed.setDescription(`
        Informações do cargo vip **${role.name}**:\n\n**Cargo:** ${role} | ${role.members.size}\n
        **Fundador:** ${user.tag}\n
        **Usuários:**${codeblock(`Online: ${filterS('online')}\nDnd: ${filterS('dnd')}\nIdle: ${filterS('idle')}\nOffline: ${filterS('offline')}`)}
        ${user.id === message.author.id ? `\n**Para adicionar mais usuários:**\n${codeblock(`${message.prefix}vip add <usuário>`)}\n
        **Para remover usuários:**\n${codeblock(`${message.prefix}vip remove <usuário>`)}` : ''}
        `)

        message.channel.send(embed)
    }
}