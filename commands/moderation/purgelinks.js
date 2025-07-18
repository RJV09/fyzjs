const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgelinks',
    aliases: ['purgeurls', 'clearlinks'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | You don't have the `MANAGE_MESSAGES` permission to use this command.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        let limit = parseInt(args[0]) || 100; 

        if (limit > 100) limit = 100; 

        try {
            const messages = await message.channel.messages.fetch({ limit });

            const messagesWithLinks = messages.filter(msg => {
                const urlPattern = /(https?:\/\/[^\s]+)/g; 
                return urlPattern.test(msg.content);
            });

            if (messagesWithLinks.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No links found to purge in the last 100 messages.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            await message.channel.bulkDelete(messagesWithLinks, true);

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${messagesWithLinks.size} message(s) containing links from this channel.`)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });

        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge messages containing links.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
