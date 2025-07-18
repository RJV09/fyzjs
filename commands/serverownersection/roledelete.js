const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roledelete',
    aliases: ['deleterole', 'removerole'],
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
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Roles\` permission to delete roles.`
                        )
                ]
            });
        }

        const roleNameOrId = args.join(' ');
        if (!roleNameOrId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide a role name or role ID to delete. Usage: \`!roledelete <roleName|roleId>\``
                        )
                ]
            });
        }

        let role = message.guild.roles.cache.get(roleNameOrId) || message.guild.roles.cache.find(r => r.name.toLowerCase() === roleNameOrId.toLowerCase());
        if (!role) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Could not find a role with that name or ID.`
                        )
                ]
            });
        }

        if (role.managed) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | This role is managed by an integration and cannot be deleted.`
                        )
                ]
            });
        }

        if (role.position >= message.guild.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I cannot delete this role because my highest role is lower or equal to the role's position.`
                        )
                ]
            });
        }

        try {
            await role.delete(`Deleted by ${message.author.tag}`);

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully deleted the role **${role.name}**.`
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
                            `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while deleting the role. Please try again later.`
                        )
                ]
            });
        }
    }
};
