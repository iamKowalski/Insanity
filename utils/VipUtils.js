module.exports = class VipUtils {
    static async Add(client, id, newRole) {
        const { vipRole } = await client.database.users.get(id)
        if (vipRole === newRole.id) throw new Error('ALREADY')
        await client.database.users.update(id, { vipRole: newRole.id })
    }

    static async setUser(client, id, user) {
        const { vipRole } = await client.database.users.get(id)
        if (vipRole) {
            const { vipUser } = await client.database.users.get(user)
            if (vipUser && vipUser != id) throw new Error('OTHER')
            await client.database.users.update(user, { vipUser: id })
        } else throw new Error('NOT_ROLE')
    }

    static async removeUser(client, id, user) {
        const { vipRole } = await client.database.users.get(id)
        if (vipRole) {
            const { vipUser } = await client.database.users.get(user)
            if (vipUser && vipUser != id) throw new Error('OTHER_USER')
            await client.database.users.update(user, { vipUser: null })
        } else throw new Error('NOT_VIP')
    }
}