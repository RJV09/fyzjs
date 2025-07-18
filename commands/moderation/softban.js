const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'softban',
    aliases: ['tempban', 'kickban'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
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
                                `<:emoji_1725906884992:1306038885293494293>  | Please Provide a valid user ID or Mention a member.`
                            )
                    ]
                });
            }
        }

        let reason = args.slice(1).join(' ') || 'No reason provided.';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;

        const userNotFoundEmbed = new MessageEmbed()
            .setDescription(`<:emoji_1725906884992:1306038885293494293> | User Not Found`)
            .setColor(client.color);

        if (user === undefined) return message.channel.send({ embeds: [userNotFoundEmbed] });

        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | If you softban me, who will protect your server?`
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
                            `<:emoji_1725906884992:1306038885293494293>  | I can't softban the owner of this server.`
                        )
                ]
            });
        }

        if (!client.util.hasHigher(message.member)) {
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


        let check = message.guild.members.cache.has(user.id);
        if (check === true || user.banable) {
            try {
                const softBanMessage = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(
                        `**You have been softbanned from ${message.guild.name}**\nExecutor: ${message.author.tag}\nReason: \`${reason}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                let member = await message.guild.members.fetch(user, true);

                await message.guild.members.ban(member.id, { reason: reason });
                await message.guild.members.unban(member.id);

                await member.send({ embeds: [softBanMessage] }).catch((err) => null);
            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | My highest role is below **<@${user.id}>**`
                    )
                    .setColor(client.color);
                return message.channel.send({ embeds: [embed] });
            }

            const done = new MessageEmbed()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully softbanned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);
            return message.channel.send({ embeds: [done] });
        }

        if (check === false) {
            try {
                const softBanMessage = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(
                        `**You have been softbanned from ${message.guild.name}**\nExecutor: ${message.author.tag}\nReason: \`${reason}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                let member = await client.users.fetch(user, true);

                await message.guild.bans.create(member.id, { reason: reason });
                await message.guild.bans.remove(member.id);

            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | My highest role is below or the same as **<@${user.id}>**`
                    )
                    .setColor(client.color);
                return message.channel.send({ embeds: [embed] });
            }
            const done = new MessageEmbed()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully softbanned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);
            return message.channel.send({ embeds: [done] });
        }
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
