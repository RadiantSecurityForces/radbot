// commands/addmission.js
const fs = require('fs').promises;
const path = require('path');  // Import the 'path' module
const Discord = require('discord.js');

const questions = [
    "What is the title of the mission?",
    "Provide a brief description of the mission.",
    "What is the initial progress percentage?"
];

module.exports = {
    name: 'addmission',
    description: 'Add a mission and save its information.',
    async execute(message, args) {
        let answers = [];
        let currentQuestionIndex = 0;

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { time: 60000 });

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Mission Information')
            .setDescription('Please answer the following questions:')
            .setFooter('Note: Avoid using spaces or special characters in the mission title.');

        const questionMessage = await message.channel.send({ embeds: [embed] });

        function sendNextQuestion() {
            if (currentQuestionIndex < questions.length) {
                embed.setDescription(questions[currentQuestionIndex]);
                questionMessage.edit({ embeds: [embed] });
            } else {
                collector.stop();

                const title = answers[0];
                const description = answers[1];
                const progress = parseInt(answers[2]);

                const missionData = {
                    title,
                    description,
                    progress
                };

                const missionFilePath = path.join(__dirname, '..', 'missionData', `${title}.json`);

                try {
                    // Create the missionData directory if it doesn't exist
                     fs.mkdir(path.join(__dirname, '..', 'missionData'), { recursive: true });

                     fs.writeFile(missionFilePath, JSON.stringify(missionData, null, 4), 'utf8');
                    message.reply(`Mission "${title}" added.`);
                } catch (error) {
                    console.error('Error saving mission data:', error);
                    message.reply(`An error occurred while adding mission "${title}".`);
                }
            }
        }

        sendNextQuestion();

        collector.on('collect', async response => {
            answers.push(response.content);
            currentQuestionIndex++;
            sendNextQuestion();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.reply('You took too long to respond. The command has been cancelled.');
            }
        });
    },
};
