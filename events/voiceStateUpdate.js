module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        const joinChannel = newState.guild.channels.cache.find(
            (channel) => channel.name === 'Join to Create' && channel.type === 'GUILD_VOICE'
        );

        if (oldState.channelId !== newState.channelId && newState.channelId === joinChannel.id) {
            try {
                const existingChannel = newState.guild.channels.cache.find(
                    (channel) => channel.name === `${newState.member.user.username}'s Channel` && channel.type === 'GUILD_VOICE'
                );

                if (!existingChannel) {
                    const tempChannel = await newState.guild.channels.create(
                        `${newState.member.user.username}'s Channel`,
                        {
                            type: 'GUILD_VOICE',
                            parent: joinChannel.parent.id, 
                            userLimit: 30, 
                        }
                    );

                    await newState.member.voice.setChannel(tempChannel);
                    const interval = setInterval(async () => {
                        if (tempChannel.members.size === 0) {
                            clearInterval(interval);
                            await tempChannel.delete();
                        }
                    }, 5000);
                } else {

                    await newState.member.voice.setChannel(existingChannel);
                }
            } catch (error) {
                console.error('Error creating temporary channel:', error);
            }
        }


        if (oldState.channelId && oldState.channelId !== newState.channelId) {
            const tempChannel = oldState.guild.channels.cache.find(
                (channel) => channel.name === `${oldState.member.user.username}'s Channel` && channel.type === 'GUILD_VOICE'
            );


            if (tempChannel && tempChannel.members.size === 0) {
                await tempChannel.delete();
            }
        }
    });
};
