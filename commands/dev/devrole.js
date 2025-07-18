const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'devrole',
  category: 'owner',
  description: 'Add or remove a role from a user by finding the role ID.',
  usage: 'devrole <add/remove> <user_id> <role_id>',
  run: async (client, message, args) => {
    const ownerIds = ['1294173092234526770'];
    if (!ownerIds.includes(message.author.id)) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('This command is only for my owner, you cannot use this command.');
      return message.channel.send({ embeds: [embed] });
    }

    // Check if the correct number of arguments are provided
    if (args.length < 3) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Please provide the action (add/remove), user ID, and role ID.\nUsage: `devrole <add/remove> <user_id> <role_id>`');
      return message.channel.send({ embeds: [embed] });
    }

    const action = args[0].toLowerCase(); // add or remove
    const userId = args[1];
    const roleId = args[2];

    // Validate action
    if (action !== 'add' && action !== 'remove') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Invalid action. Please use `add` or `remove`.');
      return message.channel.send({ embeds: [embed] });
    }

    try {
      // Fetch the user and role directly from the guild
      const user = await message.guild.members.fetch(userId).catch(() => null);
      const role = message.guild.roles.cache.get(roleId);

      if (!user || !role) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setDescription('Invalid user ID or role ID. Please provide valid IDs.');
        return message.channel.send({ embeds: [embed] });
      }

      if (action === 'add') {
        // Check if the user already has the role
        if (user.roles.cache.has(role.id)) {
          const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(`User **${user.user.tag}** already has the role **${role.name}**.`);
          return message.channel.send({ embeds: [embed] });
        }

        await user.roles.add(role);
        const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setDescription(`✅ Added role **${role.name}** to user **${user.user.tag}**.`);
        return message.channel.send({ embeds: [embed] });
      } else if (action === 'remove') {
        // Check if the user has the role
        if (!user.roles.cache.has(role.id)) {
          const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(`User **${user.user.tag}** does not have the role **${role.name}**.`);
          return message.channel.send({ embeds: [embed] });
        }

        await user.roles.remove(role);
        const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setDescription(`✅ Removed role **${role.name}** from user **${user.user.tag}**.`);
        return message.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error managing roles:', error);
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Failed to manage roles. Please check the bot\'s permissions and try again.');
      return message.channel.send({ embeds: [embed] });
    }
  }
};