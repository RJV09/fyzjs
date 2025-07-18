const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listbooster',
    aliases: ['boosters'],
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


        const boosters = members.filter(member => member.premiumSince);

        if (boosters.size === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | No one has boosted the server yet.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const boosterListEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Boosters in Server')
            .setDescription('Here is the list of boosters in this server:')
            .addField('Boosters', boosters.map(booster => `${booster.user.tag} (ID: ${booster.user.id})`).join('\n'), true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [boosterListEmbed] });
    }
};
