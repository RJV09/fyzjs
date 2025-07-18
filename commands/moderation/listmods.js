const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listmods',
    aliases: ['moderators'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_GUILD'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | You need the `MANAGE_GUILD` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const moderatorRoles = ['Moderator', 'Admin', 'Staff']; 

        const members = await message.guild.members.fetch();

        const moderators = members.filter(member => 
            member.roles.cache.some(role => moderatorRoles.includes(role.name))
        );

        if (moderators.size === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | There are no moderators in this server.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const modListEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Moderators in Server')
            .setDescription('Here is the list of moderators in this server:')
            .addField('Moderators', moderators.map(mod => `${mod.user.tag} (ID: ${mod.user.id})`).join('\n'), true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [modListEmbed] });
    }
};
