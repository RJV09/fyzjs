const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Giveaway = require('../../models/giveaway.js'); // Adjust the path as needed
const { endGiveaway, activeTimeouts } = require('../../index.js');

module.exports = {
    name: 'gstart',
    category: 'give',
    aliases: ['giveaway'],
    description: 'Begins a new giveaway event.',
    premium: false,
    async run(client, message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#E6B800')
                        .setDescription(`${client.emoji.cross} | You must have \`Administration\` perms to run this command.`)
                ]
            });
        }

        if (args.length < 3) {
            return message.reply('You can use this command like this: `gstart [duration] [winners] [prize]`');
        }

        // Define emojis
        const titleEmoji = '<a:levix_supreme:1350347645067067453>'; // NEW: Emoji for title
        const giveawayEmoji = '<a:SINGLE:1352649217058930738>'; // Used in description
        const reactionEmoji = '<a:levix_supreme:1350347722129149992>'; // Used for reactions
        const separatorEmoji = '<:dot_white:1350348188627894283>';
        const reactionEmojiId = reactionEmoji.match(/\d+/)[0]; // Extract emoji ID

        const time = args[0];
        const numWinners = parseInt(args[1], 10);
        const prize = args.slice(2).join(' ');

        const validTimeFormats = ['s', 'm', 'h', 'd'];
        if (!validTimeFormats.some(format => time.endsWith(format))) {
            return message.reply('Please input the time in a proper format, for example: 5s, 10m, 1h, 2d.');
        }

        const giveawayDuration = ms(time);
        if (!giveawayDuration) {
            return message.reply('Invalid duration.');
        }

        const endTime = new Date(Date.now() + giveawayDuration);
        await message.delete();

        const embed = new MessageEmbed()
            .setTitle(`${titleEmoji} **${prize}** ${titleEmoji}`) // Using new title emoji
            .setDescription(`${separatorEmoji} Ends: <t:${Math.floor(endTime / 1000)}:R>\n${separatorEmoji} ${numWinners === 1 ? 'Winner: 1' : `Winners: ${numWinners}`}\n${separatorEmoji} Hosted by: ${message.author}\n\n${separatorEmoji} React with ${reactionEmoji} to participate!`)
            .setColor('#E6B800')
            .setTimestamp();

        const extraText = `${giveawayEmoji} **New Giveaway** ${giveawayEmoji}`;

        const giveawayMessage = await message.channel.send({ content: extraText, embeds: [embed] });
        await giveawayMessage.react(reactionEmoji); // Use the new reaction emoji

        const newGiveaway = new Giveaway({
            messageId: giveawayMessage.id,
            channelId: message.channel.id,
            prize,
            emoji: reactionEmoji, // Store the reaction emoji
            endsAt: endTime,
            guildId: message.guild.id,
            numWinners,
            hostId: message.author.id
        });

        await newGiveaway.save();

        const filter = (reaction, user) => reaction.emoji.id === reactionEmojiId && !user.bot;
        const collector = giveawayMessage.createReactionCollector({ filter, time: giveawayDuration });

        collector.on('collect', async (reaction, user) => {
            try {
                const embedDM = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
                    .setTitle('Thanks for participating in the giveaway!')
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`You have participated in a giveaway of server **${message.guild.name}**.\n[Join Our Support Server](https://discord.gg/lunardevs)`)
                    .setFooter('Best of luck!')
                    .setColor('#E6B800');

                await user.send({ embeds: [embedDM] });
            } catch (error) {
                console.error(`Failed to send DM to ${user.tag}:`, error);
            }
        });

        collector.on('end', async () => {
            try {
                await giveawayMessage.fetch();
                const reaction = giveawayMessage.reactions.cache.get(reactionEmojiId);

                if (!reaction) {
                    return message.channel.send(`No one participated in the **${prize}** giveaway!`);
                }

                const users = await reaction.users.fetch();
                const participants = users.filter(user => !user.bot).map(user => user.id);

                if (participants.length === 0) {
                    return message.channel.send(`No one participated in the **${prize}** giveaway!`);
                }

                let winners = [];
                for (let i = 0; i < numWinners; i++) {
                    if (participants.length === 0) break;
                    const winnerIndex = Math.floor(Math.random() * participants.length);
                    winners.push(`<@${participants[winnerIndex]}>`);
                    participants.splice(winnerIndex, 1);
                }

                const winnerMessage = winners.length > 0 ? winners.join(', ') : 'No winners selected!';
                
                // 🏆 Winner Announcement
                const giveawayEndMessage = {
                    content: `Congrats, ${winnerMessage}! You won **${prize}**, hosted by <@${message.author.id}>`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 5,
                                    label: 'View Giveaway',
                                    url: giveawayMessage.url
                                }
                            ]
                        }
                    ]
                };

                await message.channel.send(giveawayEndMessage);

                // 📩 DM Winners
                for (const winner of winners) {
                    const winnerId = winner.replace(/[<@>]/g, '');
                    const user = await client.users.fetch(winnerId).catch(() => null);

                    if (user) {
                        try {
                            const dmEmbed = new MessageEmbed()
                                .setTitle('🎉 Congratulations! You Won!')
                                .setDescription(`You have won **${prize}** in the giveaway hosted in **${message.guild.name}**!\n\nClick [here](${giveawayMessage.url}) to check the giveaway.`)
                                .setColor('#E6B800')
                                .setFooter('Thanks for participating!');

                            await user.send({ embeds: [dmEmbed] });
                        } catch (error) {
                            console.error(`Failed to send DM to ${user.tag}:`, error);
                        }
                    }
                }

            } catch (error) {
                console.error('Error fetching reactions:', error);
            }
        });

        const timeout = setTimeout(async () => {
            await endGiveaway(client, newGiveaway, activeTimeouts);
            collector.stop();
        }, giveawayDuration);

        activeTimeouts[giveawayMessage.id] = timeout;
    }
};

