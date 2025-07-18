const { getSettingsar } = require('../models/autorole')

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        let check =  await client.util.BlacklistCheck(member.guild)
        if(check) return  
        if (!member || !member.guild) return
        const { guild } = member
        const settings = await getSettingsar(guild)

        if (settings.autorole.length > 0) {
            let array = []

            for (let i = 0; i < settings.autorole.length; i++) {
                const roleId = settings.autorole[i]
                const role = guild.roles.cache.get(roleId)

                if (
                    role &&
                    !role.permissions.has(
                        'ADMINISTRATOR',
                        'KICK_MEMBERS',
                        'BAN_MEMBERS',
                        'MANAGE_CHANNELS',
                        'MANAGE_GUILD',
                        'MENTION_EVERYONE',
                        'MANAGE_ROLES',
                        'MANAGE_WEBHOOKS'
                    )
                ) {
                    array.push(role) 
                }
            }

            try {
                await member.roles.add(array, 'Fire Autorole')
            } catch (err) {
                if (err.code === 429) {
                    await client.util.handleRateLimit()
                }
            }
        }

        if (!settings.welcome.enabled) return
        client.util.sendWelcome(member, settings)
    })
}
