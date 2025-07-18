const { Message, Client, MessageEmbed, Permissions } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'role',
    aliases: ['r'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);
        let own = message.author.id == message.guild.ownerId;

        // Permission checks
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Roles\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I don't have \`Manage Roles\` permissions to execute this command.`
                        )
                ]
            });
        }
        if (!own && message.member.roles.highest.position <= message.guild.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        // Get the target member
        let member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first();
        if (!member) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't use the command correctly.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            });
        }

        // Get the role
        let role = await findMatchingRoles(message.guild, args.slice(1).join(' '));
        role = role[0];

        if (!role) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provide a valid role.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            });
        }

        // Check if the role is managed by an integration
        if (role.managed) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | This role is managed by an integration and cannot be assigned manually.`
                        )
                ]
            });
        }

        // Check if the role is higher than the bot's highest role
        if (role.position >= message.guild.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I can't provide this role as my highest role is either below or equal to the provided role.`
                        )
                ]
            });
        }

        // Check if the user's highest role is lower than the role being assigned
        if (!own && message.member.roles.highest.position <= role.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I can't provide this role as your highest role is either below or equal to the provided role.`
                        )
                ]
            });
        }

        // Check if the member already has the role
        let hasRole = member.roles.cache.has(role.id);
        if (hasRole) {
            // Remove the role
            await member.roles.remove(role.id, `${message.author.tag}(${message.author.id})`);
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully removed <@&${role.id}> from <@${member.id}>.`
                        )
                ]
            });
        } else {
            // Add the role
            await member.roles.add(role.id, `${message.author.tag}(${message.author.id})`);
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully added <@&${role.id}> to <@${member.id}>.`
                        )
                ]
            });
        }
    }
};

function findMatchingRoles(guild, query) {
    const ROLE_MENTION = /<?@?&?(\d{17,20})>?/;
    if (!guild || !query || typeof query !== 'string') return [];

    const patternMatch = query.match(ROLE_MENTION);
    if (patternMatch) {
        const id = patternMatch[1];
        const role = guild.roles.cache.find((r) => r.id === id);
        if (role) return [role];
    }

    const exact = [];
    const startsWith = [];
    const includes = [];
    guild.roles.cache.forEach((role) => {
        const lowerName = role.name.toLowerCase();
        if (role.name === query) exact.push(role);
        if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role);
        if (lowerName.includes(query.toLowerCase())) includes.push(role);
    });
    if (exact.length > 0) return exact;
    if (startsWith.length > 0) return startsWith;
    if (includes.length > 0) return includes;
    return [];
}