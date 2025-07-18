const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'deletechannel',
    aliases: ['dc'],
    category: 'svowner',
    premium: false,

    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        // Check if the user is the server owner
        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must be the server owner to use this command.`
                        )
                ]
            });
        }

        // Check if the bot has the MANAGE_CHANNELS permission
        if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Channels\` permission to delete channels.`
                        )
                ]
            });
        }

        // Fetch the channel from the argument or mention
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide a valid channel to delete.\nYou can mention the channel or provide its ID.`
                        )
                ]
            });
        }

        // Check if the bot has permission to delete the channel
        if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I do not have permission to delete the channel: **${channel.name}**.`
                        )
                ]
            });
        }

        // Check if the channel type is allowed to be deleted
        if (channel.type === 'GUILD_CATEGORY' || channel.type === 'GUILD_STORE' || channel.type === 'GUILD_NEWS') {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I cannot delete this type of channel (category, store, or news channels).`
                        )
                ]
            });
        }

        // Attempt to delete the channel
        try {
            await channel.delete(`Deleted by ${message.author.tag}`);
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully deleted the channel: **${channel.name}**.`
                        )
                ]
            });
        } catch (err) {
            console.error('Error deleting channel:', err);
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while deleting the channel. Please try again later.`
                        )
                ]
            });
        }
    }
};