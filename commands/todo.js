const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = {
    name: 'todo',
    description: 'Manage your TODO list with reminders.',
    async execute(message, args) {
        const userId = message.author.id;
        const todoFilePath = './commands/todo.json';

        let tasks = await loadTasks(todoFilePath);
        if (!tasks[userId]) {
            tasks[userId] = [];
            await saveTasks(tasks, todoFilePath);
        }

        const userTasks = tasks[userId];

        const filter = response => response.author.id === userId;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        let currentStep = 0;
        const answers = [];

        collector.on('collect', async response => {
            const answer = response.content;

            if (currentStep === 0) {
                const task = answer;
                answers.push(task);
                currentStep++;

                const nextPrompt = `When should I remind you about the task "${task}"? (e.g., 1 hour, 30 minutes)`;
                message.channel.send(nextPrompt);
            } else if (currentStep === 1) {
                // Second response, asking for reminder time
                const reminderTime = parseReminderTime(answer);
                if (reminderTime !== null) {
                    answers.push(reminderTime);
                    currentStep++;

                    const nextPrompt = getReminderPrompt(reminderTime);
                    message.channel.send(nextPrompt);
                } else {
                    const invalidTimeEmbed = createInvalidTimeEmbed();
                    message.channel.send({ embeds: [invalidTimeEmbed] });
                }
            } else if (currentStep === 2) {
                // Third response, confirming reminder
                const confirmation = answer.toLowerCase();
                if (confirmation === 'yes' || confirmation === 'y') {
                    const task = answers[0];
                    const reminderTime = answers[1];

                    userTasks.push({ task, timestamp: reminderTime });
                    await saveTasks(tasks, todoFilePath);

                    message.reply(`Added task: "${task}" to your TODO list.`);
                    scheduleReminder(message.client, userId, task, reminderTime);

                    const embed = createTodoEmbed(userTasks);
                    message.channel.send({ embeds: [embed] });

                    collector.stop();
                } else if (confirmation === 'no' || confirmation === 'n') {
                    collector.stop();
                    message.reply('Task addition canceled.');
                } else {
                    const invalidConfirmationEmbed = createInvalidConfirmationEmbed();
                    message.channel.send({ embeds: [invalidConfirmationEmbed] });
                }
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.reply('You took too long to respond. The task addition has been canceled.');
            }
        });
    },
};

async function loadTasks(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data) || {};
    } catch (error) {
        return {};
    }
}

async function saveTasks(tasks, filePath) {
    try {
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 4), 'utf8');
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

function createTodoEmbed(tasks) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('TODO List')
        .setDescription(tasks.map((task, index) => `${index + 1}. ${task.task}`).join('\n'));
    return embed;
}

function parseReminderTime(content) {
    const timeRegex = /(\d+)\s*(hour|hours|minute|minutes)/i;
    const match = content.match(timeRegex);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const millisecondsPerUnit = unit === 'hour' || unit === 'hours' ? 3600000 : 60000; // 1 hour or 1 minute in milliseconds
        return Date.now() + value * millisecondsPerUnit;
    }
    return null;
}

function getReminderPrompt(reminderTime) {
    const prompt = `Great! I will remind you about this task ${formatTimeToHuman(reminderTime)}. Is that correct? (yes/no)`;
    return prompt;
}

function createInvalidTimeEmbed() {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription("I couldn't understand the time format you provided. Please use a format like '1 hour' or '30 minutes'.");
    return embed;
}

function createInvalidConfirmationEmbed() {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription("I couldn't understand your response. Please respond with 'yes' or 'no'.");
    return embed;
}

function formatTimeToHuman(reminderTime) {
    const remainingTime = reminderTime - Date.now();
    const hours = Math.floor(remainingTime / 3600000);
    const minutes = Math.floor((remainingTime % 3600000) / 60000);
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

async function scheduleReminder(client, userId, task, reminderTime) {
    const user = await client.users.fetch(userId);
    const remainingTime = reminderTime - Date.now();

    setTimeout(() => {
        user.send(`Reminder: Your task "${task}" is due now!`);
    }, remainingTime);
}
