const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listjoinpos',
    aliases: ['joinposition', 'joinpos'],
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

        const sortedMembers = members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

        const joinPosEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Server Join Positions')
            .setDescription('Here is the list of members and their join positions in this server:')
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        let joinPositions = '';
        sortedMembers.forEach((member, index) => {
            joinPositions += `${index + 1}. ${member.user.tag} (ID: ${member.user.id})\n`;
        });

        if (joinPositions.length > 0) {
            joinPosEmbed.addField('Join Positions:', joinPositions);
        } else {
            joinPosEmbed.setDescription('<:emoji_1725906884992:1306038884992> | No members found in this server.');
        }

        message.channel.send({ embeds: [joinPosEmbed] });
    }
};
