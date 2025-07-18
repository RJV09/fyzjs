const { MessageEmbed } = require('discord.js');
const wait = require('wait');

module.exports = {
    name: 'whitemode',
    aliases: ['wm'],
    category: 'unbypassable',
    premium: true,
    run: async (client, message, args) => {
        const prefix = message.guild.prefix || '&';
        const option = args[0];

        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Only the server owner can run this command.`)
                ]
            });
        }

        const currentWhitelist = await client.db.get(`${message.guild.id}_wl`) || { whitelisted: [] };
        const whitelistedUsers = currentWhitelist.whitelisted;

        const whitelistEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('__**Whitemode**__')
            .setDescription(
                `Manage the whitelist of your server! Whitemode will clear the whitelist and prevent any users from being nuked unless they are on the whitelist.`
            )
            .addFields([
                {
                    name: `__**Enable Whitemode**__`,
                    value: `To enable Whitemode, use \`${prefix}whitemode enable\`.`
                },
                {
                    name: `__**Disable Whitemode**__`,
                    value: `To disable Whitemode, use \`${prefix}whitemode disable\`.`
                }
            ]);

        if (!option) {
            return message.channel.send({ embeds: [whitelistEmbed] });
        }

        if (option === 'enable') {
            let msg = await message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Initializing Quick Setup!`)
                ]
            });

            const steps = [
                'Step 1: Clearing existing whitelist...',
                'Step 2: Removing users from the whitelist...',
                'Step 3: Finalizing setup...'
            ];

            for (let i = 0; i < steps.length; i++) {
                await wait(3000); 
                await msg.edit({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | ${steps[i]}`)
                    ]
                });
            }

            const enabledEmbed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<a:stolen_emoji:1330526992298414131> | **Whitemode has been enabled!**\nAll previous whitelist entries have been cleared.`
                );

            await msg.edit({ embeds: [enabledEmbed] });

        } else if (option === 'disable') {
            const removedUsers = await client.db.get(`${message.guild.id}_whitelist_removed`) || [];

            if (removedUsers.length === 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | No users were removed from the whitelist for this server.`)
                    ]
                });
            }

            let updatedWhitelist = [...removedUsers];

            await client.db.set(`${message.guild.id}_wl`, { whitelisted: updatedWhitelist });

            const disabledEmbed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `**Whitemode has been disabled!**\nAll previously removed whitelisted users for this server have been restored.`
                );

            await message.channel.send({ embeds: [disabledEmbed] });

        } else {
            return message.channel.send({ embeds: [whitelistEmbed] });
        }
    }
};
