const { MessageEmbed } = require('discord.js');

let enable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let disable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let protect = `<:mod:1290920326313672766>`;
let hii = `<:Bl_dot:1291391196270428232>`;


let raidDetected = `<a:warning:123456789012345678>`; 

module.exports = {
    name: 'antiraidmode',
    aliases: ['raidmode', 'ar'],
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 30) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | **Your Server Doesn't Meet My 30 Member Criteria**`)
                ]
            });
        }

        let own = message.author.id == message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild);
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | **Only the server owner or an extra owner with a higher role than mine is authorized to execute this command.**`)
                ]
            });
        }

        if (!own && !(message?.guild.members.cache.get(client.user.id).roles.highest.position <= message?.member?.roles?.highest.position)) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<:emoji_1725906884992:1306038885293494293>  | **Only the server owner or extra owner with a higher role than mine can execute this command.**`);
            return message.channel.send({ embeds: [higherole] });
        }

        let prefix = '$' || message.guild.prefix;
        const option = args[0];
        const isRaidActivatedAlready = await client.db.get(`${message.guild.id}_antiraid`);

        let configEmbed;
        if (isRaidActivatedAlready) {
            configEmbed = new MessageEmbed()
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({
                    name: `${client.user.username} Security`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(client.color)
                .setDescription(
                    `**Anti-Raid Protection For ${message.guild.name} ${protect}**\n\nTip: **To optimize the functionality of my Anti-Raid Module, please move my role to the top of the roles list.** ${hii}\n\n***__Modules Enabled__*** ${protect}\n**Mass Invite Detection: ${enable}\nMass Role Changes: ${enable}\nMass Member Joins: ${enable}\nMass Channel/Role Creation/Deletion: ${enable}**`
                );
        } else {
            configEmbed = new MessageEmbed()
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({
                    name: `${client.user.username} Security`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(client.color)
                .setDescription(`**Anti-Raid Protection For ${message.guild.name} ${protect}**\n\nTip: **To optimize the functionality of my Anti-Raid Module, please move my role to the top of the roles list.** ${hii}\n\n***__Modules Disabled__*** ${protect}\n**To enable Anti-Raid, use \`${prefix}antiraid enable\`**`);
        }

        configEmbed.setFooter({
            text: `Punishment Type: Ban`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

        const antiraid = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`Anti-Raid Protection`)
            .setDescription(`**Strengthen your server's defenses against raids with Anti-Raid Mode! This will swiftly detect and take action against suspicious activities such as mass invites, member joins, and more. Enable it now!**`)
            .addFields(
                {
                    name: ` Enable Anti-Raid`,
                    value: `**To enable Anti-Raid, use \`${prefix}antiraid enable\`**`
                },
                {
                    name: ` Disable Anti-Raid`,
                    value: `**To disable Anti-Raid, use \`${prefix}antiraid disable\`**`
                },
                {
                    name: ` Anti-Raid Configuration`,
                    value: `**To view or configure Anti-Raid settings, use** \`${prefix}antiraid config\``
                }
            );

        if (!option) {
            message.channel.send({ embeds: [antiraid] });
        } else if (option === 'enable') {
            if (isRaidActivatedAlready) {
                const enableEmbed = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setTitle(`Security Settings For ${message.guild.name} ${protect}`)
                    .setDescription(`**Anti-Raid is already enabled.**\nTo Disable, use ${prefix}antiraid disable`);
                message.channel.send({ embeds: [enableEmbed] });
            } else {

                await client.db.set(`${message.guild.id}_antiraid`, true);
                await client.db.set(`${message.guild.id}_raid_whitelist`, { whitelisted: [] });

                const enabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: `${client.user.username} Security`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor(client.color)
                    .setDescription(`**Anti-Raid is Now Enabled**`)
                    .setFooter({
                        text: `Punishment Type: Ban`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });
                message.channel.send({ embeds: [enabled] });
            }
        } else if (option === 'disable') {
            if (!isRaidActivatedAlready) {
                const disableEmbed = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Anti-Raid is already disabled.**\nTo Enable, use ${prefix}antiraid enable`);
                message.channel.send({ embeds: [disableEmbed] });
            } else {
                await client.db.set(`${message.guild.id}_antiraid`, null);
                await client.db.set(`${message.guild.id}_raid_whitelist`, { whitelisted: [] });

                const disabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Anti-Raid has been disabled for this server.**\nTo Enable use ${prefix}antiraid enable`);
                message.channel.send({ embeds: [disabled] });
            }
        } else if (option === 'config') {
            message.channel.send({ embeds: [configEmbed] });
        } else {
            return message.channel.send({ embeds: [antiraid] });
        }
    }
};
