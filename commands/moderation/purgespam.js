const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgespam',
    aliases: ['purgebots', 'cleanspam'],
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
            const spamMessages = messages.filter(msg => {
                return (
                    msg.content.length > 5 && 
                    messages.some(m => m.content === msg.content && m.author.id === msg.author.id) 
                );
            });

            if (spamMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No spam found to purge.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            await message.channel.bulkDelete(spamMessages, true);

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${spamMessages.size} spam message(s) from this channel.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge spam messages.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
