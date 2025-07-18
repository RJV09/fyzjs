const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'boosterlist',
    aliases: ['boosters'],
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


        const boosterRole = message.guild.roles.cache.find(role => role.name.toLowerCase().includes('booster'));

        if (!boosterRole) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | This server doesn't have a 'Booster' role or it's not named correctly.`
                        )
                ]
            });
        }

        const boosters = message.guild.members.cache.filter(member => member.roles.cache.has(boosterRole.id));

        if (boosters.size === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | There are no boosters in this server.`
                        )
                ]
            });
        }

        const boosterList = boosters.map((member, index) => `**${index + 1}.** ${member.user.tag}`).join('\n');

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('List of Boosters')
                    .setDescription(boosterList)
                    .setFooter(`Total Boosters: ${boosters.size}`)
            ]
        });
    }
};
