const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listbans',
    aliases: ['bans'],
    category: 'mod',
    cooldown: 5,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);


        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | You need the `BAN_MEMBERS` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        try {

            const bans = await message.guild.bans.fetch();
            
            if (bans.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription('<:emoji_1725906884992:1306038884992> | There are no banned users in this server.')
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }


            const banListEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle('Banned Users in Server')
                .setDescription('Here is the list of users banned from this server:')
                .addField('Banned Users', bans.map(ban => `${ban.user.tag} (ID: ${ban.user.id})`).join('\n'), true)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            message.channel.send({ embeds: [banListEmbed] });
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | An error occurred while fetching the bans.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
