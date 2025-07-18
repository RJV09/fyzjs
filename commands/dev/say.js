const { MessageEmbed } = require('discord.js');

const botOwners = ['760143551920078861', '1314538434269937684'];

module.exports = {
    name: 'say',
    aliases: ['speak'],
    category: 'Owner',  
    description: 'Make the bot say something! (Bot Owners Only)',
    run: async (client, message, args) => {
        if (!botOwners.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('❌ | Want Access Then Dm My Dev FyZen.')
                ]
            });
        }

        if (!args.length) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color || 'BLUE') 
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | Please provide a message for me to say!')
                ]
            });
        }

        const textToSay = args.join(' ');

        try {
            await message.channel.send(textToSay);
            message.delete();
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('❌ | Something went wrong while trying to say the message.')
                ]
            });
        }
    }
};
