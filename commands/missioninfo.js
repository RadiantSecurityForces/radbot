// commands/missioninfo.js
const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = {
    name: 'missioninfo',
    description: 'Show information about a specific mission.',
    async execute(message, args) {
        const missionTitle = args[0];

        if (!missionTitle) {
            return message.reply('Please provide a mission title.');
        }

        const missionFilePath = `${__dirname}/../missionData/${missionTitle}.json`;

        try {
            const missionData = await fs.readFile(missionFilePath, 'utf8');
            const missionInfo = JSON.parse(missionData);

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Mission Info: ${missionTitle}`)
                .addField('Title:', missionInfo.title)
                .addField('Description:', missionInfo.description)
                .addField('Progress:', `${missionInfo.progress}%`);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching mission info:', error);
            message.reply(`An error occurred while fetching info for mission "${missionTitle}".`);
        }
    },
};
