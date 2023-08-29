// commands/editvictim.js
const fs = require('fs').promises;
const Discord = require('discord.js');

const questions = [
    "What is the name of the Victim?",
    "Please provide the Victim's User iD",
    "Please provide the Socials of the Victim. (links, etc.)",
    "Please provide some notes on the Victim."
];

module.exports = {
    name: 'editvictim',
    description: 'Edit victim information.',
    async execute(message, args) {
        const victimName = args[0];

        if (!victimName) {
            return message.reply('Please provide a victim name.');
        }

        const victimFilePath = `${__dirname}/../victimData/${victimName}.json`;

        try {
            const victimData = await fs.readFile(victimFilePath, 'utf8');
            const victimInfo = JSON.parse(victimData);

            let answers = [victimInfo.username, victimInfo.contacts, victimInfo.socials, victimInfo.notes];
            let currentQuestionIndex = 0;

            const filter = response => response.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, { time: 60000 });

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Editing Victim: ${victimName}`)
                .setDescription('Please provide the new information:');

            const questionMessage = await message.channel.send({ embeds: [embed] });

            function sendNextQuestion() {
                if (currentQuestionIndex < questions.length) {
                    embed.setDescription(questions[currentQuestionIndex]);
                    questionMessage.edit({ embeds: [embed] });
                } else {
                    collector.stop();

                    const newUsername = answers[0];
                    const newContacts = answers[1];
                    const newSocials = answers[2];
                    const newNotes = answers[3];

                    const newVictimData = {
                        username: newUsername,
                        contacts: newContacts,
                        socials: newSocials,
                        notes: newNotes
                    };

                    fs.writeFile(victimFilePath, JSON.stringify(newVictimData, null, 4), 'utf8')
                        .then(() => {
                            message.reply(`Victim ${victimName} updated.`);
                        })
                        .catch(error => {
                            console.error('Error updating victim data:', error);
                            message.reply(`An error occurred while updating victim ${victimName}.`);
                        });
                }
            }

            sendNextQuestion();

            collector.on('collect', async response => {
                answers[currentQuestionIndex] = response.content;
                currentQuestionIndex++;
                sendNextQuestion();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    message.reply('You took too long to respond. The command has been cancelled.');
                }
            });
        } catch (error) {
            console.error('Error fetching victim info:', error);
            message.reply(`An error occurred while fetching info for victim ${victimName}.`);
        }
    },
};
