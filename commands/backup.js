const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'backup',
    description: 'Create backups of JSON files and send them to a specific channel.',
    async execute(message, args) {
        const backupChannels = await getBackupChannels();
        const guildId = message.guild.id;
        let backupChannelId = backupChannels[guildId];

        if (!backupChannelId) {
            await message.reply("Please provide the ID of the channel where you want to send backup files.");
            const response = await message.channel.awaitMessages({
                max: 1,
                time: 60000,
                errors: ['time'],
                filter: m => m.author.id === message.author.id
            });

            backupChannelId = response.first().content;
            backupChannels[guildId] = backupChannelId;
            await saveBackupChannels(backupChannels);
            await message.reply(`Backup channel ID set to: ${backupChannelId}`);
        }

        const backupFolderPath = './backup/';

        const backupChannel = message.guild.channels.cache.get(backupChannelId);
        if (!backupChannel || backupChannel.type !== 'GUILD_TEXT') {
            return message.reply('Backup channel not found.');
        }

        try {
            // Create the backup folder if it doesn't exist
            await fs.mkdir(backupFolderPath, { recursive: true });

            const missionDataFolderPath = 'D:/Discord/RadiantForce/CyberSecurity/RadiantSecBot/missionData';  // MAKE SURE TO EDIT THE PATH TO YOUR NEEDS
            const victimDataFolderPath = 'D:/Discord/RadiantForce/CyberSecurity/RadiantSecBot/victimData';    // MAKE SURE TO EDIT THE PATH TO YOUR NEEDS
            const todoJsonPath = 'D:/Discord/RadiantForce/CyberSecurity/RadiantSecBot/commands/todo.json';    // MAKE SURE TO EDIT THE PATH TO YOUR NEEDS  
            const userProfileFolderPath = 'D:/Discord/RadiantForce/CyberSecurity/RadiantSecBot/user_profiles';// MAKE SURE TO EDIT THE PATH TO YOUR NEEDS


            const jsonFiles = [];

            // List all JSON files in the missionData directory
            const missionDataFiles = await fs.readdir(missionDataFolderPath);
            jsonFiles.push(...missionDataFiles.filter(file => file.endsWith('.json')));

            // List all JSON files in the victimData directory
            const victimDataFiles = await fs.readdir(victimDataFolderPath);
            jsonFiles.push(...victimDataFiles.filter(file => file.endsWith('.json')));

            // List all JSON files in the user_profiles directory
            const userProfileData = await fs.readdir(userProfileFolderPath);
            jsonFiles.push(...userProfileData.filter(file => file.endsWith('.json')));

            // Include the todo.json file
            jsonFiles.push(path.basename(todoJsonPath));

            // Backup each JSON file
            for (const jsonFile of jsonFiles) {
                let fileContent;
                if (missionDataFiles.includes(jsonFile)) {
                    fileContent = await fs.readFile(path.join(missionDataFolderPath, jsonFile), 'utf8');
                } else if (victimDataFiles.includes(jsonFile)) {
                    fileContent = await fs.readFile(path.join(victimDataFolderPath, jsonFile), 'utf8');
                } else {
                    fileContent = await fs.readFile(todoJsonPath, 'utf8');
                }
                await fs.writeFile(path.join(backupFolderPath, jsonFile), fileContent, 'utf8');
            }

            // Send the backup files to the specified channel
            for (const jsonFile of jsonFiles) {
                await backupChannel.send({
                    files: [{
                        attachment: path.join(backupFolderPath, jsonFile),
                        name: jsonFile
                    }]
                });
            }

            message.reply('Backup completed successfully.');

        } catch (error) {
            console.error('Error during backup:', error);
            message.reply('An error occurred during backup.');
        }
    },
};

// Function to get the backup channels from storage
async function getBackupChannels() {
    try {
        const data = await fs.readFile('./backup.json', 'utf8');
        return JSON.parse(data) || {};
    } catch (error) {
        return {};
    }
}

// Function to save the backup channels to storage
async function saveBackupChannels(backupChannels) {
    try {
        await fs.writeFile('./backup.json', JSON.stringify(backupChannels, null, 4), 'utf8');
    } catch (error) {
        console.error('Error saving backup channels:', error);
    }
}
