const ReactionRole = require('../models/reactionRole.js');

module.exports = (client) => {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;

        try {
            const roleData = await ReactionRole.findOne({ messageId: reaction.message.id, emoji: reaction.emoji.name });
            if (!roleData) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            if (member) {
                await member.roles.add(roleData.roleId);
                console.log(`[Reaction Role] Added role ${roleData.roleId} to ${user.tag}`);
            }
        } catch (error) {
            console.error(`[Reaction Role Error]`, error);
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return;

        try {
            const roleData = await ReactionRole.findOne({ messageId: reaction.message.id, emoji: reaction.emoji.name });
            if (!roleData) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            if (member) {
                await member.roles.remove(roleData.roleId);
                console.log(`[Reaction Role] Removed role ${roleData.roleId} from ${user.tag}`);
            }
        } catch (error) {
            console.error(`[Reaction Role Error]`, error);
        }
    });
};
