const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgeuser',
    aliases: ['purgeusermessages', 'purgeusermsgs'],
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

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | Please mention a user or provide their ID to purge their messages.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        let limit = parseInt(args[1]) || 100; 
        if (limit > 100) limit = 100;

        try {
            const messages = await message.channel.messages.fetch({ limit });
            const userMessages = messages.filter(msg => msg.author.id === user.id);

            if (userMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293> | No messages found from ${user.tag} to purge.`)
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }


            await message.channel.bulkDelete(userMessages, true);

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${userMessages.size} message(s) from ${user.tag}.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge messages from this user.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
