const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'automodrules',
    aliases: ['automod', 'modrules'],
    cooldown: 5,
    category: 'automod',
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You need \`Administrator\` permission to use this command.`)
                ]
            });
        }

        const option = args[0];
        const currentStatus = {
            link: (await client.db.get(`automod_link_${message.guild.id}`)) ?? false,
            mention: (await client.db.get(`automod_mention_${message.guild.id}`)) ?? false,
            badwords: (await client.db.get(`automod_badwords_${message.guild.id}`)) ?? false,
            spam: (await client.db.get(`automod_spam_${message.guild.id}`)) ?? false,
        };

        if (!option) {
            const helpEmbed = new MessageEmbed()
                .setTitle('Automod Rules Setup')
                .setColor(client.color)
                .setDescription('Configure the automod rules to protect your server from various issues like spam, bad links, excessive mentions, etc.')
                .addField('Enable/Disable Anti-Link', '`$automodrules link enable` or `$automodrules link disable`')
                .addField('Enable/Disable Anti-Mention', '`$automodrules mention enable` or `$automodrules mention disable`')
                .addField('Enable/Disable Anti-Bad Words', '`$automodrules badwords enable` or `$automodrules badwords disable`')
                .addField('Enable/Disable Anti-Spam', '`$automodrules spam enable` or `$automodrules spam disable`')
                .addField('View Automod Status', '`$automodrules status`')
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return message.channel.send({ embeds: [helpEmbed] });
        }

        if (option === 'status') {
            const statusEmbed = new MessageEmbed()
                .setTitle('Automod Rules Status')
                .setColor(client.color)
                .addField('Anti-Link', currentStatus.link ? 'Enabled' : 'Disabled')
                .addField('Anti-Mention', currentStatus.mention ? 'Enabled' : 'Disabled')
                .addField('Anti-Bad Words', currentStatus.badwords ? 'Enabled' : 'Disabled')
                .addField('Anti-Spam', currentStatus.spam ? 'Enabled' : 'Disabled')
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return message.channel.send({ embeds: [statusEmbed] });
        }

        const rule = args[0].toLowerCase();
        const action = args[1]?.toLowerCase();

        if (['link', 'mention', 'badwords', 'spam'].includes(rule)) {
            if (!['enable', 'disable'].includes(action)) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setDescription('<:emoji_1725906884992:1306038885293494293>  | Please specify `enable` or `disable` to change the rule status.')
                    ]
                });
            }

            await client.db.set(`automod_${rule}_${message.guild.id}`, action === 'enable');
            
            const successEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle(`Automod Rule - ${rule.charAt(0).toUpperCase() + rule.slice(1)} ${action.charAt(0).toUpperCase() + action.slice(1)}`)
                .setDescription(`Automod rule for ${rule} has been successfully ${action === 'enable' ? 'enabled' : 'disabled'}.`)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return message.channel.send({ embeds: [successEmbed] });
        }

        const errorEmbed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Invalid command or option. Please use \`$automodrules\` for help.`)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        message.channel.send({ embeds: [errorEmbed] });
    }
};
