const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'boostcount',
    aliases: ['boosts', 'boostlevel', 'bc'],
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

        const boostCount = message.guild.premiumSubscriptionCount;
        const boostLevel = message.guild.premiumTier; 

        const boostCountEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Server Boost Count and Level')
            .setDescription('Here is the boost count and level for this server:')
            .addField('Boost Count', boostCount.toString(), true)
            .addField('Boost Level', `Level ${boostLevel}`, true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [boostCountEmbed] });
    }
};
