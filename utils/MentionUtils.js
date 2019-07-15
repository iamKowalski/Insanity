const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/
const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/

module.exports = class MentionUtils {
    static Role(guild, arg) {
        const regexResultRole = MENTION_ROLE_REGEX.exec(arg)
        const idRole = regexResultRole && regexResultRole[1]
        const role = guild.roles.get(idRole)

        return role
    }

    static User(client, guild, arg) {
        const regexResultUser = MENTION_REGEX.exec(arg)
        const idUser = regexResultUser && regexResultUser[1]
        const findMember = guild.members.find(m => m.user.username.toLowerCase().includes(arg.toLowerCase()) || m.displayName.toLowerCase().includes(arg.toLowerCase()))
        const guildUser = client.users.get(idUser) || (!!findMember && findMember.user)

        return guildUser
    }
}