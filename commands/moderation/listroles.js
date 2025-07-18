const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listroles',
    aliases: ['roles'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_ROLES'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);
        
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | You need the `MANAGE_ROLES` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.name);

        if (roles.length === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | There are no roles in this server.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const rolesListEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Roles in Server')
            .setDescription(`Here are all the roles in this server:`)
            .addField('Roles', roles.join('\n'), true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [rolesListEmbed] });
    }
};
