const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'botlist',
    aliases: ['bots'],
    category: 'info',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Server\` permission to use this command.`
                        )
                ]
            });
        }

        const bots = message.guild.members.cache.filter(member => member.user.bot);

        if (bots.size === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | There are no bots in this server.`
                        )
                ]
            });
        }


        const botList = bots.map((bot, index) => `**${index + 1}.** ${bot.user.tag}`).join('\n');

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('List of Bots')
                    .setDescription(botList)
                    .setFooter(`Total Bots: ${bots.size}`)
            ]
        });
    }
};
