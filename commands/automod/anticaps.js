const { MessageEmbed } = require('discord.js');
const wait = require('wait');

module.exports = {
    name: 'anticaps',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable', 'punishment'],
    premium: false,
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (message.guild.memberCount < 30) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | Your Server Doesn\'t Meet My 30 Member Criteria'),
                ],
            });
        }

        let own = message.author.id == message.guild.ownerId;
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | You must have `Administrator` permissions to use this command.'),
                ],
            });
        }

        if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | I don\'t have `Administrator` permissions to execute this command.'),
                ],
            });
        }

        if (!own && message.member.roles.highest.position <= message.guild.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | You must have a higher role than me to use this command.'),
                ],
            });
        }

        let prefix = message.guild.prefix || '$'; 
        const option = args[0];
        const isActivatedAlready = (await client.db.get(`anticaps_${message.guild.id}`)) ?? null;

        const anticaps = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('Anticaps')
            .setDescription(
                "Anticaps helps prevent excessive use of uppercase letters in messages. It ensures that your server remains friendly and respectful!"
            )
            .addField('__**Anticaps Enable**__', `To enable anticaps, use \`${prefix}anticaps enable\``)
            .addField('__**Anticaps Disable**__', `To disable anticaps, use \`${prefix}anticaps disable\``)
            .addField('__**Anticaps Punishment**__', 'Configure the punishment for users posting messages with excessive caps.')
            .addField('Options', '`ban` - Ban users\n`kick` - Kick users\n`mute` - Mute users')
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        switch (option) {
            case undefined:
                message.channel.send({ embeds: [anticaps] });
                break;

            case 'enable':
                if (!isActivatedAlready) {
                    await client.db.set(`anticaps_${message.guild.id}`, true);
                    await client.db.set(`anticapsp_${message.guild.id}`, { data: 'mute' });

                    const anticapsEnableMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anticaps Enabled')
                        .setDescription('<a:Tick:1306038825054896209> | Anticaps has been successfully enabled on your server.')
                        .addField('Enhanced Protection', 'Your server is now protected from excessive use of uppercase letters.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [anticapsEnableMessage] });
                } else {
                    const anticapsSettingsEmbed = new MessageEmbed()
                        .setTitle(`Anticaps Settings for ${message.guild.name}`)
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | Anticaps is already enabled on your server.')
                        .addField(
                            'Current Status',
                            `<:emoji_1725906884992:1306038885293494293> | Anticaps is enabled.\nCurrent Status: <a:Tick:1306038825054896209>`
                        )
                        .addField('To Disable', `To disable Anticaps, use \`${prefix}anticaps disable\``)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [anticapsSettingsEmbed] });
                }
                break;

            case 'disable':
                if (isActivatedAlready) {
                    await client.db.set(`anticaps_${message.guild.id}`, false);
                    await client.db.set(`anticapsp_${message.guild.id}`, { data: null });

                    const anticapsDisableMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anticaps Disabled')
                        .setDescription('<a:Tick:1306038825054896209> | Anticaps has been successfully disabled on your server.')
                        .addField('Impact', 'Your server will no longer be protected against excessive use of uppercase letters.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [anticapsDisableMessage] });
                } else {
                    const anticapsSettingsEmbed = new MessageEmbed()
                        .setTitle(`Anticaps Settings for ${message.guild.name}`)
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | Anticaps is already disabled.')
                        .addField('Current Status', 'Anticaps is currently disabled.\nCurrent Status: <a:Tick:1306038825054896209>')
                        .addField('To Enable', `To enable Anticaps, use \`${prefix}anticaps enable\``)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [anticapsSettingsEmbed] });
                }
                break;

            case 'punishment':
                let punishment = args[1];
                if (!punishment) {
                    const embedMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription('**Invalid Punishment**')
                        .addField('Error', 'Please provide valid punishment arguments.')
                        .addField('Valid Options', '`ban`, `kick`, `mute`')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    return message.channel.send({ embeds: [embedMessage] });
                }

                if (punishment === 'ban') {
                    await client.db.set(`anticapsp_${message.guild.id}`, { data: 'ban' });
                    const embedMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription('<a:Tick:1306038825054896209> | The punishment has been successfully configured.')
                        .addField('Punishment Type', 'Ban')
                        .addField('Action Taken', '<a:Tick:1306038825054896209> | Any user violating the rule will be banned from the server.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'kick') {
                    await client.db.set(`anticapsp_${message.guild.id}`, { data: 'kick' });
                    const embedMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription('<a:Tick:1306038825054896209> | The punishment has been successfully configured.')
                        .addField('Punishment Type', 'Kick')
                        .addField('Action Taken', 'Any user violating the rule will be kicked from the server.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'mute') {
                    await client.db.set(`anticapsp_${message.guild.id}`, { data: 'mute' });
                    const embedMessage = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anticaps Punishment Configured')
                        .setDescription('<a:Tick:1306038825054896209> | The anticaps punishment has been successfully configured.')
                        .addField('Punishment Type', 'Mute')
                        .addField('Action Taken', 'Any user violating the rule will be muted.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL());

                    await message.channel.send({ embeds: [embedMessage] });
                }
                break;
        }
    },
};
