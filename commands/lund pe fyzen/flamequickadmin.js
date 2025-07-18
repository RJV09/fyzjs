const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'antiquickadmin',
    description: 'Enable or disable anti quick admin role assignment',
    run: async (client, message, args) => {
        const option = args[0];
        const prefix = await client.db.get(`${message.guild.id}_prefix`) || '&'; 
        
        const isActivated = await client.db.get(`${message.guild.id}_antiquickadmin`);

        if (!option) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setTitle(`AntiQuickAdmin Protection`)
                        .setDescription(`**Enhance your server's security with AntiQuickAdmin protection. This feature provides advanced security mechanisms to protect your server from malicious bots and activities.**`)
                        .addFields(
                            {
                                name: `Enable AntiQuickAdmin Protection`,
                                value: `**To enable AntiQuickAdmin, use \`${prefix}antiquickadmin enable\`**`
                            },
                            {
                                name: `Disable AntiQuickAdmin Protection`,
                                value: `**To disable AntiQuickAdmin, use \`${prefix}antiquickadmin disable\`**`
                            },
                            {
                                name: `Add a user to AntiQuickAdmin Bypass`,
                                value: `**To add a user to the AntiQuickAdmin Bypass list, use** \`${prefix}bypassadd <user>\``
                            },
                            {
                                name: `Remove a user from AntiQuickAdmin Bypass`,
                                value: `**To remove a user from the AntiQuickAdmin Bypass list, use** \`${prefix}bypassremove <user>\``
                            }
                        )
                ]
            });
        }

        if (option === 'enable') {
            if (isActivated) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`**AntiQuickAdmin is already enabled!**\nTo disable, use \`${prefix}antiquickadmin disable\``)
                    ]
                });
            }

            await client.db.set(`${message.guild.id}_antiquickadmin`, true);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`**AntiQuickAdmin has been enabled for ${message.guild.name}!**`)
                ]
            });
        } else if (option === 'disable') {
            if (!isActivated) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`**AntiQuickAdmin is already disabled!**\nTo enable, use \`${prefix}antiquickadmin enable\``)
                    ]
                });
            }

            await client.db.set(`${message.guild.id}_antiquickadmin`, false);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`**AntiQuickAdmin has been disabled for ${message.guild.name}!**`)
                ]
            });
        } else {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`**Enhance your server's security with AntiQuickAdmin protection. This feature provides advanced security mechanisms to protect your server from malicious bots and activities.**`)
                        .addFields(
                            {
                                name: `Enable AntiQuickAdmin Protection`,
                                value: `**To enable AntiQuickAdmin, use \`${prefix}antiquickadmin enable\`**`
                            },
                            {
                                name: `Disable AntiQuickAdmin Protection`,
                                value: `**To disable AntiQuickAdmin, use \`${prefix}antiquickadmin disable\`**`
                            },
                            {
                                name: `Add a user to AntiQuickAdmin Bypass`,
                                value: `**To add a user to the AntiQuickAdmin Bypass list, use** \`${prefix}bypassadd <user>\``
                            },
                            {
                                name: `Remove a user from AntiQuickAdmin Bypass`,
                                value: `**To remove a user from the AntiQuickAdmin Bypass list, use** \`${prefix}bypassremove <user>\``
                            }
                        )
                ]
            });
        }
    }
};
