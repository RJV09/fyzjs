const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rolecreate',
    aliases: ['createRole', 'addrole'],
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

        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must be the server owner to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Roles\` permission to create roles.`
                        )
                ]
            });
        }

        const roleName = args[0];
        const roleColor = args[1] ? args[1] : '#000000'; 

        if (!roleName) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide a name for the role. Usage: \`!rolecreate <roleName> [color]\``
                        )
                ]
            });
        }

        try {
            const newRole = await message.guild.roles.create({
                name: roleName,
                color: roleColor,
                reason: `Role created by ${message.author.tag}`
            });

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully created the role **${newRole.name}** with color **${newRole.hexColor}**.`
                        )
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while creating the role. Please try again later.`
                        )
                ]
            });
        }
    }
};
