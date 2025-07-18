const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: 'premium',
    description: "Show the user's profile",
    aliases: [],
    subcommand: ['activate', 'revoke', 'validity', 'stats'],
    premium: false,
    run: async (client, message, args) => {
        // **🔹 Fetching Guild Prefix**
        let guildPrefix = await client.db.get(`prefix_${message.guild.id}`) || '&'; // Default prefix: "&"

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setFooter(`Developed By FyZen Team`);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Premium')
                .setStyle('LINK')
                .setURL('https://discord.gg/lunardevs')
        );

        let link = 'https://discord.gg/lunardevs';

        if (!args[0]) {
            embed.setAuthor(
                `${client.user.username} Premium`,
                client.user.displayAvatarURL(),
                link
            )
            embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
            embed.setDescription(
                `If you are a subscriber, you can **upgrade** this server by typing \`${guildPrefix}premium activate\`\n` +
                `If you have activated [Premium](${link}) here then you can **downgrade** [Premium](${link}) from this server by typing \`${guildPrefix}premium revoke\`\n` +
                `To check the [Premium](${link}) status of this server just type \`${guildPrefix}premium validity\`\n` +
                `To check your [Premium](${link}) status just type \`${guildPrefix}premium stats\`.\n` +
                `[Click here](${link}) to Get **[Premium](${link})**`
            )
            return message.reply({ embeds: [embed], components: [row] });
        }

        const isprem = await client.db.get(`uprem_${message.author.id}`);
        let type = args[0].toLowerCase();
        let own = await client.db.get(`spremown_${message.guild.id}`);
        let servers = (await client.db.get(`upremserver_${message.author.id}`)) || [];
        let isp = await client.db.get(`sprem_${message.guild.id}`);
        let time = await client.db.get(`upremend_${message.author.id}`);
        let count = (await client.db.get(`upremcount_${message.author.id}`)) || 0;

        switch (type) {
            case `activate`:
                if (!isprem)
                    return message.reply({ embeds: [embed.setDescription(`You don't have any type of premium subscription. Click [here](${link}) to [Purchase](${link}).`)], components: [row] });

                if (count < 1)
                    return message.reply({ embeds: [embed.setDescription(`You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`)], components: [row] });

                if (isp === `true`)
                    return message.reply({ embeds: [embed.setDescription(`This server's [Premium](${link}) has already been activated by <@${own}>.`)] });

                if (count > 0) {
                    await client.db.set(`sprem_${message.guild.id}`, `true`);
                    await client.db.set(`spremend_${message.guild.id}`, time);
                    await client.db.set(`spremown_${message.guild.id}`, `${message.author.id}`);
                    await client.db.set(`upremcount_${message.author.id}`, count - 1);
                    servers.push(`${message.guild.id}`);
                    await client.db.set(`upremserver_${message.author.id}`, servers);
                    await message.reply({
                        embeds: [embed.setDescription(`This server has been added as a [Premium](${link}) Server.\n[Premium](${link}) valid till: <t:${Math.round(time / 1000)}> (<t:${Math.round(time / 1000)}:R>)`)]
                    });
                    await message.guild.me.setNickname('FyZen Pro');
                }
                break;

            case `revoke`:
                if (!isprem)
                    return message.reply({ embeds: [embed.setDescription(`You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`)], components: [row] });

                if (!isp)
                    return message.reply({ embeds: [embed.setDescription(`This server hasn't any type of premium subscription! Use \`${guildPrefix}premium activate\` to upgrade.\nClick [here](${link}) to [Purchase](${link}).`)], components: [row] });

                if (own !== message.author.id)
                    return message.reply({ embeds: [embed.setDescription(`You haven't activated the [Premium](${link}) on this Server to revoke it.`)] });

                await client.db.delete(`sprem_${message.guild.id}`);
                await client.db.delete(`spremend_${message.guild.id}`);
                await client.db.delete(`spremown_${message.guild.id}`);
                await client.db.set(`upremcount_${message.author.id}`, count + 1);
                servers = servers.filter((srv) => srv != `${message.guild.id}`);
                await client.db.set(`upremserver_${message.author.id}`, servers);
                return message.reply({ embeds: [embed.setDescription(`You have successfully **revoked** the [Premium](${link}) from this server.`)] });
                break;

            case `validity`:
                if (!isp)
                    return message.reply({ embeds: [embed.setDescription(`This server hasn't any type of premium subscription! Use \`${guildPrefix}premium activate\` to upgrade.\nClick [here](${link}) to [Purchase](${link}).`)], components: [row] });

                return message.reply({
                    embeds: [
                        embed.setDescription(
                            `**Premium: \`Active\`\nPremium Activator: <@${own}>\nPremium Ends: <t:${Math.round(time / 1000)}> (<t:${Math.round(time / 1000)}:R>)**`
                        )
                    ]
                });
                break;

            case `stats`:
                if (!isprem)
                    return message.reply({ embeds: [embed.setDescription(`You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`)], components: [row] });

                let info = servers.length < 1 ? `No Servers` : servers.map((srv, i) => `${i + 1} - <t:${Math.round(time / 1000)}> (<t:${Math.round(time / 1000)}:R>)`).join("\n");

                return message.reply({
                    embeds: [
                        embed
                            .setDescription(`**Premium Count: \`${count}\`\nPremium Ends: <t:${Math.round(time / 1000)}> (<t:${Math.round(time / 1000)}:R>)**`)
                            .addField(`**Servers where you activated Premium**`, `\`\`\`nim\n${info}\`\`\``)
                    ]
                });

            default:
                embed.setAuthor(
                    `${client.user.username} Premium`,
                    client.user.displayAvatarURL(),
                    link
                )
                embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
                embed.setDescription(
                    `Use \`${guildPrefix}premium activate\` to upgrade this server.\n` +
                    `Use \`${guildPrefix}premium revoke\` to downgrade.\n` +
                    `Check server status: \`${guildPrefix}premium validity\`\n` +
                    `Check your status: \`${guildPrefix}premium stats\`.\n` +
                    `[Click here](${link}) to Get **[Premium](${link})**`
                )
                return message.reply({ embeds: [embed], components: [row] });
        }
    }
};
