const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: 'noprefix',
    aliases: ['np'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!client.config.np.includes(message.author.id)) return;

        const embed = new MessageEmbed().setColor(client.color);
        let prefix = message.guild.prefix;

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove/list>\` \`<user id>\` \`<time>\``
                        )
                ]
            });
        }

        if (args[0].toLowerCase() === 'list') {
            let listing = await client.db.get(`noprefix_${client.user.id}`) || [];
            let info = [];
        
            if (listing.length < 1) info.push(`No Users ;-;`);
            else {
                for (let i = 0; i < listing.length; i++) {
                    const userEntry = listing[i];
                    const user = await client.users.fetch(userEntry.userId).catch(() => null);
                    const expiration = userEntry.expiration === 'Unlimited' 
                        ? 'Unlimited' 
                        : `<t:${Math.floor(userEntry.expiration / 1000)}:D>`;
        
                    if (user) {
                        info.push(`${i + 1}) ${user.tag} (${user.id}) Expires: ${expiration}`);
                    } else {
                        info.push(`${i + 1}) Unknown User (${userEntry.userId}) Expires: ${expiration}`);
                    }
                }
            }
        
            return await pagination(message, info, '**No Prefix Users List :-**', client.color);
        }

        let check = 0;
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove/list>\` \`<user id>\` \`<time>\``
                        )
                ]
            });
        }

        let user = await client.users.fetch(`${args[1]}`).catch(() => {
            check += 1;
        });

        if (check == 1) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Invalid User ID provided.\n${prefix}noprefix \`<add/remove/list>\` \`<user id>\` \`<time>\``
                        )
                ]
            });
        }

        let added = await client.db.get(`noprefix_${client.user.id}`) || [];
        let opt = args[0].toLowerCase();
        let expiryDate = null;

        if (args[2]) {
            const time = args[2];
            const amount = parseInt(time.slice(0, -1));
            const unit = time.slice(-1);

            if (isNaN(amount) || !['d', 'm', 'y'].includes(unit)) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `Invalid time format. Use \`1d\` for 1 day, \`1m\` for 1 month, or \`1y\` for 1 year.`
                            )
                    ]
                });
            }

            expiryDate = new Date();
            if (unit === 'd') expiryDate.setDate(expiryDate.getDate() + amount);
            if (unit === 'm') expiryDate.setMonth(expiryDate.getMonth() + amount);
            if (unit === 'y') expiryDate.setFullYear(expiryDate.getFullYear() + amount);
        }

        if (opt == 'add' || opt == 'a' || opt == '+') {
            if (added.some(entry => entry.userId === user.id)) {
                return message.channel.send({
                    content: `${client.emoji.cross} This User is already present in my No Prefix`
                });
            }
        
            let expiration = 'Unlimited';
            if (args[2]) {
                const timeUnit = args[2].slice(-1);
                const timeAmount = parseInt(args[2].slice(0, -1));
        
                if (timeUnit && !isNaN(timeAmount)) {
                    let expirationDate = new Date();
                    if (timeUnit === 'd') {
                        expirationDate.setDate(expirationDate.getDate() + timeAmount);
                    } else if (timeUnit === 'm') {
                        expirationDate.setMonth(expirationDate.getMonth() + timeAmount);
                    } else if (timeUnit === 'y') {
                        expirationDate.setFullYear(expirationDate.getFullYear() + timeAmount);
                    }
        
                    expiration = `<t:${Math.floor(expirationDate.getTime() / 1000)}:D>`; 
                    added.push({ userId: user.id, expiration: expirationDate.getTime() });
                }
            } else {
                added.push({ userId: user.id, expiration: 'Unlimited' });
            }
        
            await client.db.set(`noprefix_${client.user.id}`, added);
            client.util.noprefix();
        
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been added as a **No Prefix** user. Expires: ${expiration}.`
                        )
                ]
            });
        }

        if (opt == 'remove' || opt == 'r' || opt == '-') {
            if (!added.some(entry => entry.userId === user.id)) {
                return message.channel.send({
                    content: `${client.emoji.cross} This User is not in the No Prefix list.`
                });
            }

            added = added.filter(entry => entry.userId !== user.id);
            await client.db.set(`noprefix_${client.user.id}`, added);
            client.util.noprefix();

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been removed from the **No Prefix** user list.`
                        )
                ]
            });
        }

        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(
                        `${prefix}noprefix \`<add/remove/list>\` \`<user id>\` \`<time>\``
                    )
            ]
        });
    }
};

const pagination = async (message, data, title, color) => {
    const itemsPerPage = 10;
    const pages = Math.ceil(data.length / itemsPerPage);
    let currentPage = 0;

    const generatePage = () => {
        const pageStart = currentPage * itemsPerPage;
        const pageEnd = pageStart + itemsPerPage;
        return data.slice(pageStart, pageEnd).join('\n');
    };

    const updateEmbed = async (msg) => {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(generatePage())
            .setFooter(`Page ${currentPage + 1} of ${pages}`);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prevButton')
                    .setLabel('Previous')
                    .setStyle('SECONDARY')
                    .setDisabled(currentPage === 0),
                new MessageButton()
                    .setCustomId('nextButton')
                    .setLabel('Next')
                    .setStyle('SECONDARY')
                    .setDisabled(currentPage === pages - 1)
            );

        await msg.edit({ embeds: [embed], components: [row] });
    };

    const embedMessage = await message.channel.send({ 
        embeds: [new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(generatePage())
            .setFooter(`Page ${currentPage + 1} of ${pages}`)], 
        components: [new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prevButton')
                    .setLabel('Previous')
                    .setStyle('SECONDARY')
                    .setDisabled(currentPage === 0),
                new MessageButton()
                    .setCustomId('nextButton')
                    .setLabel('Next')
                    .setStyle('SECONDARY')
                    .setDisabled(currentPage === pages - 1)
            )] 
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = embedMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
        if (interaction.customId === 'prevButton' && currentPage > 0) {
            currentPage--;
        } else if (interaction.customId === 'nextButton' && currentPage < pages - 1) {
            currentPage++;
        }
        await updateEmbed(interaction.message);
        await interaction.deferUpdate();
    });

    collector.on('end', () => {
        if (!embedMessage.deleted && embedMessage.editable) {
            embedMessage.edit({ components: [] });
        }
    });
};

const removeDuplicates = (array) => {
    return [...new Set(array)];
};
