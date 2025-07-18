const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    aliases: ['hackban', 'fuckban', 'fuckoff'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Check if the user has permission to ban members
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

        // Check if the bot has permission to ban members
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }

        // Fetch the user from mention or ID
        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | Please provide a valid user ID or mention.`
                            )
                    ]
                });
            }
        }

        // Check if the user exists
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | User not found.`
                        )
                ]
            });
        }

        // Prevent banning the bot or the server owner
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | If you ban me, who will protect your server?`
                        )
                ]
            });
        }

        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I can't ban the owner of this server.`
                        )
                ]
            });
        }

        // Check if the bot's role is higher than the user's role
        const botMember = message.guild.members.cache.get(client.user.id);
        const userMember = await message.guild.members.fetch(user.id).catch(() => null);

        if (userMember && botMember.roles.highest.position <= userMember.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | My highest role is below or equal to **<@${user.id}>**.`
                        )
                ]
            });
        }

        // Ban the user
        const reason = args.slice(1).join(' ') || 'No reason provided';
        const formattedReason = `${message.author.tag} (${message.author.id}) | ${reason}`;

        try {
            // Send a DM to the user before banning
            const banMessage = new MessageEmbed()
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription(
                    `You have been banned from **${message.guild.name}**.\n**Executor:** ${message.author.tag}\n**Reason:** \`${reason}\``
                )
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            await user.send({ embeds: [banMessage] }).catch(() => null); // Ignore if DM fails

            // Ban the user
            await message.guild.members.ban(user.id, { reason: formattedReason });

            // Send success message
            const successEmbed = new MessageEmbed()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully banned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);

            return message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            // No error logging or reply for failed bans
            return; // Silently fail without logging or replying
        }
    }
};

// Helper function to fetch user from mention
function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}