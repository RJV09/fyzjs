const {
    MessageEmbed,
    MessageSelectMenu,
    MessageButton,
    MessageActionRow
} = require('discord.js')
const { Fire } = require('../../structures/FyZen')
module.exports = {
    name: 'whitelist',
    aliases: ['wl'],
    
    category: 'security',
    premium: true,
    /**
     * @param {Fire} client
     */
    run: async (client, message, args) => {
        if (message.guild.memberCount < 1) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your server does not meet the requirements for accommodating my 30-member criteria.`
                        )
                ]
            })
        }
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an additional owner is authorized to run this command.`
                        )
                ]
            })
        }
        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            )
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only the server owner or an extra owner with a higher role than mine is authorized to run this command.`
                )
            return message.channel.send({ embeds: [higherole] })
        }
        const antinuke = await client.db.get(`${message.guild.id}_antinuke`)
        if (!antinuke) {
            const dissable = new MessageEmbed().setColor(client.color)
                .setDescription(` ** ${message.guild.name} security settings <a:Fire_antinuke_cmd:1180431827438153821>
Ohh NO! looks like your server doesn't enabled security

Current Status : <:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812>

To enable use antinuke enable ** `)
            message.channel.send({ embeds: [dissable] })
        } else {
            const member =
                message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
            const wl = new MessageEmbed()
                .setColor(client.color)
                .setTitle(`__**Whitelist Commands**__`)
                .setDescription(
                    `**Adds user to whitelisted users which means that there will be no actions taken on the whitelisted members if they trigger the antinuke module.**`
                )
                .addFields([
                    {
                        name: `__**Usage**__`,
                        value: `<a:emoji_1725906997325:1306042477282590771> \`${message.guild.prefix}whitelist @user/id\`\n<a:emoji_1725906997325:1306042477282590771> \`${message.guild.prefix}wl @user\``
                    }
                ])
            if (!member) return message.channel.send({ embeds: [wl] })
            let data = await client.db?.get(
                `${message.guild.id}_${member.id}_wl`
            )
            if (data !== null) {
                if (
                    data.ban &&
                    data.kick &&
                    data.prune &&
                    data.botadd &&
                    data.serverup &&
                    data.memup &&
                    data.chcr &&
                    data.chup &&
                    data.chdl &&
                    data.rlcr &&
                    data.rldl &&
                    data.rlup &&
                    data.meneve &&
                    data.mngweb &&
                    data.mngstemo
                )
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | <@${member.id}> is already a whitelisted member.`
                                )
                        ]
                    })
            }

            await client.db?.set(`${message.guild.id}_${member.id}_wl`, {
                ban: false,
                kick: false,
                prune: false,
                botadd: false,
                serverup: false,
                memup: false,
                chcr: false,
                chup: false,
                chdl: false,
                rlcr: false,
                rldl: false,
                rlup: false,
                meneve: false,
                mngweb: false,
                mngstemo: false
            })
            let menu = [
                {
                    label: 'Ban',
                    value: 'ban',
                    description: 'Whitelistes a member with ban permission'
                },
                {
                    label: 'Kick',
                    value: 'kick',
                    description: 'Whitelistes a member with kick permission'
                },
                {
                    label: 'Prune',
                    value: 'prune',
                    description: 'Whitelistes a member with prune permission'
                },
                {
                    label: 'Bot Add',
                    value: 'botadd',
                    description: 'Whitelistes a member with bot add permission'
                },
                {
                    label: 'Server Update',
                    value: 'serverup',
                    description:
                        'Whitelistes a member with server update permission'
                },
                {
                    label: 'Member Update',
                    value: 'memup',
                    description:
                        'Whitelistes a member with member update permission'
                },
                {
                    label: 'Channel Create',
                    value: 'chcr',
                    description:
                        'Whitelistes a member with channel create permission'
                },
                {
                    label: 'Channel Delete',
                    value: 'chdl',
                    description:
                        'Whitelistes a member with channel delete permission'
                },
                {
                    label: 'Channel Update',
                    value: 'chup',
                    description:
                        'Whitelistes a member with channel update permission'
                },
                {
                    label: 'Role Create',
                    value: 'rlc',
                    description:
                        'Whitelistes a member with role create permission'
                },
                {
                    label: 'Role Update',
                    value: 'rlup',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Role Delete',
                    value: 'rldl',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Mention Everyone',
                    value: 'meneve',
                    description:
                        'Whitelistes a member with mention everyone permission'
                },
                {
                    label: 'Manage Webhook',
                    value: 'mngweb',
                    description:
                        'Whitelistes a member with manage webhook permission'
                },
                {
                    label: 'Manage Stickers & Emojis',
                    value: 'mngstemo',
                    description:
                        'Whitelistes a member with Manage stickers & emojis permission'
                }
            ]
            let menuSelect = new MessageSelectMenu()
                .setCustomId('wl')
                .setMinValues(1)
                .setOptions([menu])
                .setPlaceholder('Choose Your Options')
            let btn = new MessageButton()
                .setLabel('Add This User To All Categories')
                .setStyle('PRIMARY')
                .setCustomId('catWl')
            const row2 = new MessageActionRow().addComponents([btn])
            const row = new MessageActionRow().addComponents([menuSelect])
            let msg
            if (
                !data?.ban &&
                !data?.kick &&
                !data?.prune &&
                !data?.botadd &&
                !data?.serverup &&
                !data?.memup &&
                !data?.chcr &&
                !data?.chup &&
                !data?.chdl &&
                !data?.rlcr &&
                !data?.rldl &&
                !data?.rlup &&
                !data?.meneve &&
                !data?.mngweb &&
                !data?.mngstemo
            ) {
                msg = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Developed by ${client.user.username} Development`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Ban**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Kick**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Prune**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Bot Add**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Server Update\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : Member Role Update**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Channel Create**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> :** Channel Delete**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Channel Update**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Role Create**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Role Delete**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Role Update**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Mention** @everyone\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Webhook Management**\n<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> : **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            } else {
                msg = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Developed by ${client.user.username} Development`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            }
            const collector = msg.createMessageComponentCollector({
                filter: (i) => (i.isSelectMenu() || i.isButton) && i.user,
                time: 60000
            })
            collector.on('collect', async (i) => {
                i = await i
                if (i.user.id !== message.author.id)
                    return i.reply({
                        content: `Only <@${message.author.id}> Can Use This Intraction`,
                        ephemeral: true
                    })
                if (i.isButton()) {
                    if (i.customId == 'catWl') {
                        i.deferUpdate()
                        data = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        data.ban = true
                        data.kick = true
                        data.prune = true
                        data.botadd = true
                        data.serverup = true
                        data.memup = true
                        data.chcr = true
                        data.chdl = true
                        data.chup = true
                        data.rlcr = true
                        data.rldl = true
                        data.rlup = true
                        data.meneve = true
                        data.mngweb = true
                        data.mngstemo = true
                        menuSelect = menuSelect.setDisabled(true)
                        btn = btn.setDisabled(true)
                        const newRow = new MessageActionRow().addComponents([
                            menuSelect
                        ])
                        const newRow1 = new MessageActionRow().addComponents([
                            btn
                        ])
                        msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Developed by ${client.user.username} Development`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${i.user.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                        let wls = []
                        const wl = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        if (wl)
                            if (wl.length > 0) {
                                wl.map((w) => wls.push(w))
                            }
                        wls.push(member.id)
                        let already1 = await client.db.get(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )

                        if (already1) {
                            await client.db.pull(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        } else {
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        }

                        return client.db?.set(
                            `${i.guild.id}_${member.id}_wl`,
                            data
                        )
                    }
                }
                if (i.isSelectMenu()) {
                    data = await client.db?.get(`${i.guild.id}_${member.id}_wl`)
                    i.deferUpdate()
                    if (i.values.includes('ban')) {
                        data.ban = data.ban ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('kick')) {
                        data.kick = data.kick ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('prune')) {
                        //aise
                        data.prune = data.prune ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('botadd')) {
                        data.botadd = data.botadd ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('serverup')) {
                        data.serverup = data.serverup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('memup')) {
                        data.memup = data.memup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chcr')) {
                        data.chcr = data.chcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chdl')) {
                        data.chdl = data.chdl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chup')) {
                        data.chup = data.chup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlc')) {
                        data.rlcr = data.rlcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rldl')) {
                        data.rldl = data.rldl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlup')) {
                        data.rlup = data.rlup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('meneve')) {
                        data.meneve = data.meneve ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngweb')) {
                        data.mngweb = data.mngweb ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngstemo')) {
                        data.mngstemo = data.mngstemo ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    let wls = []
                    const wl = await client.db?.get(
                        `${message.guild.id}_${member.id}_wl`
                    )
                    if (wl !== null)
                        if (wl.length > 0) {
                            wl.map((w) => wls.push(w))
                        }
                    wls.push(member.id)
                    let arr = [...new Set(wls)]
                    client.db?.set(`${message.guild.id}_${member.id}_wl`, arr)
                    menuSelect = menuSelect.setDisabled(true)
                    btn = btn.setDisabled(true)
                    const newRow = new MessageActionRow().addComponents([
                        menuSelect
                    ])
                    const newRow1 = new MessageActionRow().addComponents([btn])
                    if (msg)
                        msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Developed by ${client.user.username} Development`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Ban**\n${data.kick ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Kick**\n${data.prune ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Prune**\n${data.botadd ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Bot Add**\n${data.serverup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Server Update\n${data.memup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: Member Role Update**\n${data.chcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Create**\n${data.chdl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: ** Channel Delete**\n${data.chup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Channel Update**\n${data.rlcr ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Create**\n${data.rldl ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Delete**\n${data.rlup ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Role Update**\n${data.meneve ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Mention** @everyone\n${data.mngweb ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Webhook Management**\n${data.mngstemo ? '<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131> ' : '<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812> '}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                    let wlls = []
                    const wll = await client.db?.get(
                        `${i.guild.id}_${member.id}_wl`
                    )
                    if (wll)
                        if (wll.length > 0) {
                            wll.map((w) => wlls.push(w))
                        }
                    wls.push(member.id)

                    let already = await client.db.get(
                        `${message.guild.id}_wl.whitelisted`,
                        member.id
                    )

                    if (already) {
                        await client.db.pull(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    } else {
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    }

                    return client.db?.set(
                        `${message.guild.id}_${member.id}_wl`,
                        data
                    )
                }
            })
        }
    }
}
