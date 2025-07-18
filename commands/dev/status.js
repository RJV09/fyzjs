const { MessageEmbed } = require('discord.js');
const ricky = ['760143551920078861', '1243888482355511328']; 

module.exports = {
    name: 'xstatus', 
    aliases: [], 
    category: 'Owner',
    run: async (client, message, args) => {
        if (!ricky.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('<:emoji_1725906884992:1306038885293494293> You don\'t have permission to use this command!')
                ]
            });
        }

        if (args[0] === 'status') {
            if (!args[1]) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<:emoji_1725906884992:1306038885293494293> Please provide a valid status (online, idle, dnd).')
                    ]
                });
            }

            const status = args[1].toLowerCase();
            if (!['online', 'idle', 'dnd'].includes(status)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<:emoji_1725906884992:1306038885293494293> Invalid status! Please use `online`, `idle`, or `dnd`.')
                    ]
                });
            }

            try {
                await client.user.setPresence({
                    status: status, 
                });

                const successEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`<a:Tick:1306038825054896209> Successfully set bot's status to **${status}**.`);

                return message.channel.send({ embeds: [successEmbed] });
            } catch (error) {
                console.error('Error setting bot status:', error);
                const errorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<:emoji_1725906884992:1306038885293494293> An error occurred while changing the bot\'s status.');
                return message.channel.send({ embeds: [errorEmbed] });
            }
        }

        if (args[0] === 'playing' || args[0] === 'watching' || args[0] === 'listening') {
            if (args.length < 2) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<:emoji_1725906884992:1306038885293494293> Please provide the activity title.')
                    ]
                });
            }

            const activityType = args[0].toLowerCase();
            const activityTitle = args.slice(1).join(' '); 

            const activityTypes = {
                playing: 'PLAYING',
                watching: 'WATCHING',
                listening: 'LISTENING'
            };

            try {
                await client.user.setPresence({
                    status: 'online',
                    activities: [{ name: activityTitle, type: activityTypes[activityType] }] 
                });

                const successEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`<a:Tick:1306038825054896209> Successfully set bot's activity to **${activityType}**: **${activityTitle}**.`);

                return message.channel.send({ embeds: [successEmbed] });
            } catch (error) {
                console.error('Error setting bot activity:', error);
                const errorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<:emoji_1725906884992:1306038885293494293> An error occurred while changing the bot\'s activity.');
                return message.channel.send({ embeds: [errorEmbed] });
            }
        }

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<:emoji_1725906884992:1306038885293494293> Invalid command! Use `mbot status <online/idle/dnd>` or `mbot <playing/watching/listening> <title>`.')
            ]
        });
    }
};