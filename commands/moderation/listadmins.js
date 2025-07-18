const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listadmins',
    aliases: ['admins'],
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

        const members = await message.guild.members.fetch();

        const admins = members.filter(member => member.permissions.has('ADMINISTRATOR'));

        if (admins.size === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | There are no administrators in this server.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }


        const adminListEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Administrators in Server')
            .setDescription('Here is the list of administrators in this server:')
            .addField('Administrators', admins.map(admin => `${admin.user.tag} (ID: ${admin.user.id})`).join('\n'), true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [adminListEmbed] });
    }
};
