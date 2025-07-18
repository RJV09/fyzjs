const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mediachannel',
    aliases: ['media'],
    category: 'owner',
    premium: true,
    run: async (client, message, args) => {
        // Fix: Access config from the client object (assuming config is stored there)
        if (!client.config?.admin?.includes(message.author.id)) return;

        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed() // Fix: Changed `embed` to `new MessageEmbed()`
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            });
        }

        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        let prefix = '$' || message.guild.prefix; // Fix: Ensure this is the correct way to get the prefix
        const option = args[0];

        const media = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Media (4) **__`)
            .addFields([
                {
                    name: `__**media**__`,
                    value: `Configures the media only channels!`
                },
                {
                    name: `__**media Set**__`,
                    value: `Setup media only channel in server`
                },
                {
                    name: `__**media reset**__`,
                    value: `Disable media only channels configured in server`
                },
                {
                    name: `__**media View**__`,
                    value: `Shows the media only channels`
                }
            ]);

        if (!option) {
            message.channel.send({ embeds: [media] });
        } else if (option.toLowerCase() === 'set') {
            const channel =
                getChannelFromMention(message, args[1]) ||
                message.guild.channels.cache.get(args[1]);

            if (!channel) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | Oops! It seems there was an issue. Please make sure to provide a valid channel for the media configuration.`
                            )
                    ]
                });
            }

            if (channel.type === 'GUILD_VOICE') {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | You cannot add any voice channels as a media channel.`
                            )
                    ]
                });
            }

            if (channel) {
                await client.db.set(`mediachannel_${message.guild.id}`, {
                    channel: channel.id
                });
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | Successfully Added ${channel} As Media Only Channel.`
                            )
                    ]
                });
            }
        } else if (option.toLowerCase() === 'reset') {
            const data = await client.db.get(`mediachannel_${message.guild.id}`);
            if (!data) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | There Is No Media Only Channel Configuration In This Server.!`
                            )
                    ]
                });
            } else if (data) {
                await client.db.set(`mediachannel_${message.guild.id}`, null);
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | Successfully Disabled Media Only Configuration.!`
                            )
                    ]
                });
            }
        } else if (option.toLowerCase() === 'view') {
            const data = await client.db.get(`mediachannel_${message.guild.id}`);
            if (!data?.channel) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | No Media Only Configuration Is Set.!`
                            )
                    ]
                });
            }

            const whitelisted = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `Current media only configured channel is <#${data.channel}>`
                );
            message.channel.send({ embeds: [whitelisted] });
        }
    }
};

function getChannelFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return null;

    const channelId = matches[1];
    return message.guild.channels.cache.get(channelId);
}