const { MessageEmbed } = require('discord.js');

const botOwners = ['760143551920078861', '760143551920078861']; 

module.exports = {
    name: 'gwarn',
    aliases: ['gwarning'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!botOwners.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | You don't have permission to use this command.`)
                ]
            });
        }

        let userId = args[0];
        if (!userId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Please provide a valid user ID or mention a user.`)
                ]
            });
        }

        let user;
        try {
            user = await client.users.fetch(userId.replace(/[<@!>]/g, ''));
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Unable to fetch user. Please check the provided ID.`)
                ]
            });
        }

        try {
            const embed = new MessageEmbed()
                .setTitle('Fire Global Warning | <:stolen_emoji:1317791407695462480>')
                .setDescription(
                    `You have received a warning from the server: **${message.guild.name}**.\n\n` +
                    `**Reason:** ${args.slice(1).join(' ') || 'No specific reason provided.'}`
                )
                .setColor('#000000') 
                .setFooter('Please ensure you follow the server rules to avoid further action.');

            await user.send({ embeds: [embed] });

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<:stolen_emoji:1317791407695462480> Successfully sent a warning to **${user.tag}**.`)
                ]
            });
        } catch (error) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Failed to send a warning. The user might have DMs disabled.`)
                ]
            });
        }
    }
};