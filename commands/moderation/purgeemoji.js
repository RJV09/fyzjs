const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgeemoji',
    aliases: ['purgeemojis', 'cleanspamemoji'],
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | You don't have `MANAGE_MESSAGES` permission to use this command.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        let limit = parseInt(args[0]) || 100; 

        if (limit > 100) limit = 100; 

        try {
            const messages = await message.channel.messages.fetch({ limit });

            const emojiMessages = messages.filter(msg => {

                const emojiCount = (msg.content.match(/<a?:\w+:\d+>/g) || []).length;

                return emojiCount >= 5;
            });

            if (emojiMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No emoji spam found to purge.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            await message.channel.bulkDelete(emojiMessages, true);

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${emojiMessages.size} message(s) containing excessive emojis.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge messages with excessive emojis.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
