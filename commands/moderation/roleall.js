const { Message, Client, MessageEmbed, Permissions } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'roleall',
    aliases: ['rall'],
    category: 'mod',
    premium: true,

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

        // Handle 'roleall' command
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provide a role.\nUsage: \`${message.guild.prefix}roleall <role>\``
                        )
                ]
            });
        }

        // Find the role
        let role = await findMatchingRoles(message.guild, args.join(' '));
        role = role[0];

        if (!role) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provide a valid role.\nUsage: \`${message.guild.prefix}roleall <role>\``
                        )
                ]
            });
        }

        // Check for dangerous permissions
        const dangerousPermissions = [
            'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS',
            'MANAGE_GUILD', 'MENTION_EVERYONE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS',
            'MANAGE_EVENTS', 'MODERATE_MEMBERS', 'MANAGE_EMOJIS_AND_STICKERS'
        ];

        if (role.permissions.any(dangerousPermissions)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `${client.emoji.cross} | The role <@&${role.id}> has dangerous permissions. I won't assign it to everyone.\n**Permissions:** ${new Permissions(role.permissions.bitfield).toArray()
                                .filter(perm => dangerousPermissions.includes(perm))
                                .map(perm => `\`${perm}\``)
                                .join(', ')}`
                        )
                ]
            });
        }

        // Check if the role is editable
        if (!role.editable) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I cannot assign the role <@&${role.id}> because it is higher than my highest role.`
                        )
                ]
            });
        }

        // Fetch all members without the role
        const membersWithoutRole = await message.guild.members.fetch().then(members =>
            members.filter(member => !member.roles.cache.has(role.id))
        );

        if (membersWithoutRole.size === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `All members already have the role: ${role.name}`
                        )
                ]
            });
        }

        // Assign the role with an interval
        let count = 0;
        const totalMembers = membersWithoutRole.size;

        const progressMessage = await message.channel.send({
            embeds: [
                embed
                    .setDescription(
                        `Assigning the role <@&${role.id}> to **${totalMembers}** members...\nProgress: **0%**`
                    )
            ]
        });

        for (const member of membersWithoutRole.values()) {
            try {
                await member.roles.add(role);
                count++;

                // Update progress
                const progress = Math.floor((count / totalMembers) * 100);
                await progressMessage.edit({
                    embeds: [
                        embed
                            .setDescription(
                                `Assigning the role <@&${role.id}> to **${totalMembers}** members...\nProgress: **${progress}%**`
                            )
                    ]
                });

                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
            } catch (error) {
                console.error(`Failed to assign role to ${member.user.tag}:`, error);
            }
        }

        // Send completion message
        message.channel.send({
            embeds: [
                embed
                    .setDescription(
                        `Successfully assigned the role <@&${role.id}> to **${count}/${totalMembers}** members.`
                    )
            ]
        });
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