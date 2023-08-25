const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Show available commands and usage instructions',
  execute(message, args) {
    const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js') && file !== 'help.js');

    const embed = new MessageEmbed()
      .setTitle('Bot Commands')
      .setDescription('Here are the available commands and how to use them:')
      .setColor('#00FF00');

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      embed.addField(`${command.name}`, `${command.description}`);
    }

    embed.addField(`${emojis[command.name]} ${command.name}`, `${command.description}`);


    message.channel.send({ embeds: [embed] });
  },
};


module.exports = {
  name: 'help',
  description: 'Show available commands and usage instructions',
  execute(message, args) {
    const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js') && file !== 'help.js');

    const embed = new MessageEmbed()
      .setTitle('Bot Commands')
      .setDescription('Here are the available commands and how to use them:')
      .setColor('#00FF00');

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      embed.addField(`${command.name}`, `${command.description}`);
    }

    embed.addField(`${emojis[command.name]} ${command.name}`, `${command.description}`);


    message.channel.send({ embeds: [embed] });
  },
};
