const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_CHANNELS'], 
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | You need the `MANAGE_CHANNELS` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const time = args[0];

        if (!time) {
            const currentSlowmode = message.channel.rateLimitPerUser;
            if (currentSlowmode === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription('<a:Tick:1306038825054896209> | Slowmode is currently disabled in this channel.')
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            } else {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`<a:Tick:1306038825054896209> | Slowmode is currently set to ${currentSlowmode} seconds in this channel.`)
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }
        }

        if (isNaN(time) || time < 0 || time > 21600) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | Please provide a valid number of seconds (1 - 21600).')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        try {
            await message.channel.setRateLimitPerUser(time);
            const successEmbed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<a:Tick:1306038825054896209> | Slowmode has been set to ${time} seconds in this channel.`)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            message.channel.send({ embeds: [successEmbed] });

        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | There was an error setting the slowmode.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
