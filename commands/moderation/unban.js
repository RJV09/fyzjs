const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        // Check if the user has the BAN_MEMBERS permission
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }

        // Check if the bot has the BAN_MEMBERS permission
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Ban Members\` permissions to execute this command.`
                        )
                ]
            });
        }

        // Check if the user has a higher role than the bot
        let isown = message.author.id == message.guild.ownerId;
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        // Check if the user ID is provided
        const ID = args[0];
        if (!ID) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provide the ID of the member to unban.`
                        )
                ]
            });
        }

        try {
            // Fetch the ban to check if the user is banned
            const ban = await message.guild.bans.fetch(ID).catch(() => null);

            if (!ban) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | This user isn't banned in this server.`
                            )
                    ]
                });
            }

            // Unban the user
            await message.guild.members.unban(ID);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully unbanned the member.`
                        )
                ]
            });
        } catch (error) {
            console.error(error);

            // Handle specific errors
            if (error.code === 10026) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | This user isn't banned in this server.`
                            )
                    ]
                });
            } else {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | An error occurred while trying to unban the user.`
                            )
                    ]
                });
            }
        }
    }
};