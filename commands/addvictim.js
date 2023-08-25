// commands/addvictim.js
const fs = require('fs').promises;
const path = require('path');
const Discord = require('discord.js');

const questions = [
  "What is the name of the Victim?",
  "Please provide the Victim's User iD",
  "Please provide the Socials of the Victim. (links, etc.)",
  "Please provide some notes on the Victim."
];

module.exports = {
    name: 'addvictim',
    description: 'Add a victim and save their information.',
    async execute(message, args) {
        let answers = [];
        let currentQuestionIndex = 0;

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { time: 60000 });

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Victim Information')
            .setDescription('Please answer the following questions:');

        const questionMessage = await message.channel.send({ embeds: [embed] });

        function sendNextQuestion() {
            if (currentQuestionIndex < questions.length) {
                embed.setDescription(questions[currentQuestionIndex]);
                questionMessage.edit({ embeds: [embed] });
            } else {
                collector.stop();

                const username = answers[0];
                const contacts = answers[1];
                const socials = answers[2];
                const notes = answers[3];

                const victimData = {
                    username,
                    contacts,
                    socials,
                    notes
                };

                const victimDirectoryPath = path.join(__dirname, '..', 'victimData');
                const victimFilePath = path.join(victimDirectoryPath, `${username}.json`);

                fs.mkdir(victimDirectoryPath, { recursive: true })
                    .then(() => {
                        return fs.writeFile(victimFilePath, JSON.stringify(victimData, null, 4), 'utf8');
                    })
                    .then(() => {
                        message.reply(`Victim ${username} added.`);
                    })
                    .catch(error => {
                        console.error('Error saving victim data:', error);
                        message.reply(`An error occurred while adding victim ${username}.`);
                    });
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
