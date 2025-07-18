const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ghelp',
  category: 'giveaways',
  description: 'Shows all giveaway commands.',
  usage: 'ghelp',
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor('#FFD700')
      .setTitle('🎉 Giveaway Commands 🎉')
      .setDescription('Here is the list of available giveaway commands:')
      .addFields(
        { name: '`gstart <duration> <winners> <prize>`', value: 'Starts a giveaway. Example: `gstart 1d 1 Discord Nitro`' },
        { name: '`gend <messageId>`', value: 'Ends a giveaway manually. Example: `gend 112233445566778899`' },
        { name: '`greroll <messageId>`', value: 'Rerolls a giveaway winner. Example: `greroll 112233445566778899`' },
        { name: '`glist`', value: 'Shows all active giveaways.' },
        { name: '`gdelete <messageId>`', value: 'Deletes a giveaway. Example: `gdelete 112233445566778899`' }
      )
      .setFooter({ text: 'Use these commands to manage giveaways easily!' });

    message.channel.send({ embeds: [embed] });
  },
};
