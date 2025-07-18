const { MessageEmbed } = require('discord.js');
let enable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let disable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let protect = `<:TH_Warning:1309588102326784010>`;
const wait = require('wait');

module.exports = {
    name: 'threatmode',
    aliases: ['tm', 'threat'],
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 3) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Your Server Doesn't Meet My 3 Member Criteria`)
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
                        .setDescription(`${client.emoji.cross} | Only Server Owner Or Extraowner Can Run This Command.!`)
                ]
            });
        }

        let prefix = '&' || message.guild.prefix;
        const option = args[0];
        const isActivatedAlready = await client.db.get(`${message.guild.id}_threatmode`);
        
        const threatMode = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**ThreatMode**__`)
            .setDescription(`Enable ThreatMode to automatically ban users for dangerous actions like @everyone mentions, pruning members, or mass banning!`)
            .addFields([
                {
                    name: `__**ThreatMode Enable**__`,
                    value: `To Enable ThreatMode, Use - \`${prefix}threatmode enable\``
                },
                {
                    name: `__**ThreatMode Disable**__`,
                    value: `To Disable ThreatMode, Use - \`${prefix}threatmode disable\``
                }
            ]);

        if (!option) {
            message.channel.send({ embeds: [threatMode] });
        } else if (option === 'enable') {
            if (isActivatedAlready) {
                const alreadyEnabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\nThreatMode is already enabled!\nCurrent Status: ${enable}\nTo Disable use ${prefix}threatmode disable`);
                message.channel.send({ embeds: [alreadyEnabled] });
            } else {
                await client.db.set(`${message.guild.id}_threatmode`, true);
                const enabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({ name: `${client.user.username} Security`, iconURL: client.user.displayAvatarURL() })
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\nThreatMode is now enabled.\nPunishments: Ban users who mention @everyone, prune members, or mass ban.`);
                message.channel.send({ embeds: [enabled] });
            }
        } else if (option === 'disable') {
            if (!isActivatedAlready) {
                const alreadyDisabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\nThreatMode is already disabled.\nCurrent Status: ${disable}\nTo Enable use ${prefix}threatmode enable`);
                message.channel.send({ embeds: [alreadyDisabled] });
            } else {
                await client.db.set(`${message.guild.id}_threatmode`, null);
                const disabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\nSuccessfully disabled ThreatMode for this server.\nCurrent Status: ${disable}\nTo Enable use ${prefix}threatmode enable`);
                message.channel.send({ embeds: [disabled] });
            }
        } else {
            return message.channel.send({ embeds: [threatMode] });
        }
    },

    onMentionEveryone: async (message) => {
        const isEnabled = await client.db.get(`${message.guild.id}_threatmode`);
        if (isEnabled && message.mentions.everyone) {
            await message.member.ban({ reason: 'Mentioned @everyone in ThreatMode.' });
            message.channel.send(`${message.author.tag} has been banned for mentioning @everyone.`);
        }
    },

    onPruneMembers: async (guild, pruned) => {
        const isEnabled = await client.db.get(`${guild.id}_threatmode`);
        if (isEnabled && pruned >= 3) {

            const user = guild.members.cache.get('userID'); 
            if (user) {
                await user.ban({ reason: `Pruned ${pruned} members in ThreatMode.` });
                guild.channels.cache.first().send(`${user.tag} has been banned for pruning ${pruned} members.`);
            }
        }
    },

    onMassBan: async (guild, bans) => {
        const isEnabled = await client.db.get(`${guild.id}_threatmode`);
        if (isEnabled && bans.size >= 3) {
            const user = guild.members.cache.get('userID'); 
            if (user) {
                await user.ban({ reason: `Banned ${bans.size} members in ThreatMode.` });
                guild.channels.cache.first().send(`${user.tag} has been banned for mass banning ${bans.size} members.`);
            }
        }
    }
};