const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unmuteall',
    aliases: ['umall'],
    category: 'mod',
    premium: true,

    run: async (client, message, args) => {
        // Check if the user has the necessary permissions
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Timeout Members\` permissions to use this command.`
                        )
                ]
            });
        }

        // Check if the bot has the necessary permissions
        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Timeout Members\` permissions to run this command.`
                        )
                ]
            });
        }

        // Fetch all members in the guild
        await message.guild.members.fetch();
        const mutedMembers = message.guild.members.cache.filter(member => 
            member.communicationDisabledUntilTimestamp > Date.now()
        );

        if (mutedMembers.size === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | There are no muted members in this server.`
                        )
                ]
            });
        }

        let reason = args.join(' ').trim();
        if (!reason) reason = 'No Reason';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;

        let successCount = 0;
        let failedCount = 0;

        // Get the interval time (default: 1500ms)
        const interval = 1500; // 1.5 seconds delay between each unmute

        // Send initial progress message
        const progressMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `Unmuting **${mutedMembers.size}** members with an interval of **${interval}ms**...\nProgress: **0%**`
                    )
            ]
        });

        // Unmute each muted member with a delay
        for (const member of mutedMembers.values()) {
            try {
                const response = await unTimeoutTarget(message.member, member, reason);
                if (response === true) {
                    successCount++;
                } else {
                    failedCount++;
                }

                // Update progress
                const progress = Math.floor(((successCount + failedCount) / mutedMembers.size) * 100);
                await progressMessage.edit({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `Unmuting **${mutedMembers.size}** members with an interval of **${interval}ms**...\nProgress: **${progress}%**`
                            )
                    ]
                });

                // Wait for the interval
                await new Promise(resolve => setTimeout(resolve, interval));
            } catch (error) {
                console.error(`Failed to unmute ${member.user.tag}:`, error);
                failedCount++;
            }
        }

        // Send the result
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully unmuted **${successCount}** members. Failed to unmute **${failedCount}** members.`
                    )
            ]
        });
    }
};

async function unTimeoutTarget(issuer, target, reason) {
    if (!memberInteract(issuer, target)) return 'MEMBER_PERM';
    if (!memberInteract(issuer.guild.me, target)) return 'BOT_PERM';
    if (target.communicationDisabledUntilTimestamp - Date.now() < 0) return 'NO_TIMEOUT';

    try {
        await target.timeout(0, reason);
        return true;
    } catch (ex) {
        return 'ERROR';
    }
}

function memberInteract(issuer, target) {
    const { guild } = issuer;
    if (guild.ownerId === issuer.id) return true;
    if (guild.ownerId === target.id) return false;
    return issuer.roles.highest.position > target.roles.highest.position;
}