// commands/victimpanel.js
const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = {
    name: 'victimpanel',
    description: 'Show a panel with added victims names.',
    async execute(message, args) {
        const victimDirectoryPath = `${__dirname}/../victimData`;

        try {
            const files = await fs.readdir(victimDirectoryPath);

            if (files.length === 0) {
                return message.reply('No victims found.');
            }

            const victimNames = files.map(file => file.replace('.json', ''));

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Victim Panel')
                .setDescription('List of added victims:')
                .addField('Victims:', victimNames.join('\n'));

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching victim data:', error);
            message.reply('An error occurred while fetching victim data.');
        }
    },
};
