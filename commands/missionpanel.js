// commands/missionpanel.js
const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = {
    name: 'missionpanel',
    description: 'Show a panel with added missions.',
    async execute(message, args) {
        const missionDirectoryPath = `${__dirname}/../missionData`;

        try {
            const files = await fs.readdir(missionDirectoryPath);

            if (files.length === 0) {
                return message.reply('No missions found.');
            }

            const missionTitles = files.map(file => file.replace('.json', ''));

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Mission Panel')
                .setDescription('List of added missions:')
                .addField('Missions:', missionTitles.join('\n'));

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching mission data:', error);
            message.reply('An error occurred while fetching mission data.');
        }
    },
};
