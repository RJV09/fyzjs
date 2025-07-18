const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldState, newState) => {
    const member = newState.member;

    const isVcbanned = await client.db.get(`vcban_${newState.guild.id}_${member.id}`);

    if (isVcbanned && newState.channel) {
        try {

            await member.voice.setChannel(null);

            if (newState.channel) {
                const channel = newState.guild.channels.cache.get(newState.channel.id);
                if (channel) {
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor('BLACK')
                                .setDescription(
                                    `<a:anxCross2:1321773462699642991> | <@${member.user.id}> has been disconnected from the voice channel because they are VC-banned.`
                                ),
                        ],
                    });
                }
            }
        } catch (err) {
            console.error('Error while disconnecting VC-banned member:', err);
        }
    }
};
