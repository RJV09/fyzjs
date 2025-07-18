module.exports = async (client, message) => {

    if (!message.guild) return;

    const threatModeEnabled = message.guild.settings?.threatModeEnabled || false;  

    if (!threatModeEnabled) {
        return;
    }

    if (message.mentions.everyone) {
        try {
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
                return message.channel.send("I don't have permission to ban members.");
            }

            if (message.author.id === client.user.id) {
                return; 
            }

            await message.delete();
            await message.member.ban({ reason: 'Mentioned @everyone during threat mode' });
            message.channel.send(`${message.author.tag} has been banned for mentioning @everyone during threat mode.`);

            const logChannel = message.guild.channels.cache.find(ch => ch.name === "audit-log");
            if (logChannel) {
                logChannel.send(`${message.author.tag} was banned for mentioning @everyone during threat mode.`);
            }
        } catch (error) {
            console.error('Error banning user for mentioning @everyone during threat mode:', error);
            message.channel.send('An error occurred while banning the user. Please try again later.');
        }
    }
};