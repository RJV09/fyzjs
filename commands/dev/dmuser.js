const { MessageEmbed } = require('discord.js');

const BOT_OWNERS = ['760143551920078861', '1243888482355511328']; 

module.exports = {
    name: 'xtyper',
    aliases: ['dmuser'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!BOT_OWNERS.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Only the Specified Bot Owner(s) Can Use This Command!**`
                        )
                ]
            });
        }

        const userMention = args[0];
        const reason = args.slice(1).join(' ');

        if (!userMention) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Please Mention a User or Provide Their ID.**`
                        )
                ]
            });
        }
        if (!reason) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Please Provide a Message to Send.**`
                        )
                ]
            });
        }

        const user = getUserFromMention(client, userMention);
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Could Not Find the Specified User. Please Provide a Valid Mention or ID.**`
                        )
                ]
            });
        }

        const dmEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('🎄 Fire Message 🎄')
            .setDescription(
                `**From:** <@${message.author.id}> (${message.author.id})\n\n${reason}`
            )
            .setFooter({
                text: `Message from ${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        try {
            await user.send({ embeds: [dmEmbed] });
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Successfully Sent the Message to <@${user.id}> (${user.tag}).**`
                        )
                ]
            });
        } catch (error) {
            console.error(error); 
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Failed to Send the Message to <@${user.id}> (${user.tag}). They May Have DMs Disabled.**`
                        )
                ]
            });
        }
    }
};

function getUserFromMention(client, mention) {
    if (!mention) return null;
    const matches = mention.match(/^<@!?(\d+)>$/);
    const id = matches ? matches[1] : mention;
    return client.users.cache.get(id) || null;
}
