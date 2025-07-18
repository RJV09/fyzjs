const { MessageEmbed } = require('discord.js');
const { getBypassList } = require('../bypassManager');

module.exports = (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

        const bypassList = await getBypassList(newMember.guild.id);
        const bannedPermissions = ['ADMINISTRATOR', 'BAN_MEMBERS'];
        const addedRoles = newMember.roles.cache.filter(role => 
            role.permissions.has(bannedPermissions)
        );
        if (bypassList.includes(newMember.user.id)) {
            console.log(`${newMember.user.tag} is on the bypass list. No action taken.`);
            return;
        }

        if (addedRoles.size > 0) {
            const joinTime = newMember.joinedAt;
            const currentTime = new Date();
            const timeDiff = (currentTime - joinTime) / 1000 / 60; 
            if (timeDiff <= 5) {
                const roleAssigner = oldMember.guild.members.cache.get(newMember.guild.ownerId);

                await newMember.ban({ reason: 'Received admin or ban permission within 5 minutes of joining.' });
                await oldMember.guild.members.cache.get(newMember.guild.ownerId)?.ban({
                    reason: 'Assigned admin or ban permission to a member within 5 minutes of joining.'
                });

                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Quick Admin Ban Triggered')
                    .setDescription(`${newMember.user.tag} and ${roleAssigner.user.tag} were banned for assigning dangerous roles within 5 minutes of joining.`)
                    .setTimestamp();

                const logChannel = newMember.guild.channels.cache.find(ch => ch.name === 'logs');
                if (logChannel) logChannel.send({ embeds: [embed] });

                console.log(`Banned ${newMember.user.tag} and ${roleAssigner.user.tag} for assigning admin/ban role within 5 minutes.`);
            }
        }
    });
};
