const fs = require('fs').promises;
const Discord = require('discord.js');

const profilePath = './user_profiles/';
const badgeEmojis = {
    'Beginner': '🌱',
    'Intermediate': '🔥',
    'Advanced': '⭐',
};

async function loadOrCreateUserProfile(userId) {
    try {
        const data = await fs.readFile(`${profilePath}${userId}.json`, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        const userProfile = {
            userId: userId,
            xp: 500,
            rank: 'Beginner',
            skills: [],
            notes: [],
        };
        await saveUserProfile(userProfile);
        return userProfile;
    }
}

async function saveUserProfile(userProfile) {
    try {
        await fs.mkdir(profilePath, { recursive: true });
        await fs.writeFile(`${profilePath}${userProfile.userId}.json`, JSON.stringify(userProfile, null, 4), 'utf8');
    } catch (error) {
        console.error('Error saving user profile:', error);
    }
}

function generateProgressBar(currentValue, maxValue, size) {
    const progress = Math.min(currentValue / maxValue, 1);
    const barLength = Math.floor(progress * size);
    const progressBar = '▓'.repeat(barLength) + '░'.repeat(size - barLength);
    return `[${progressBar}]`;
}

async function displayUserProfile(message, targetUser) {
    const userProfile = await loadOrCreateUserProfile(targetUser.id);

    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`User Profile for ${targetUser.username}`)
        .setThumbnail(targetUser.avatarURL() || 'https://i.imgur.com/placeholder.png');

    if (userProfile) {
        embed.addField('XP', userProfile.xp.toString(), true);
        embed.addField('Rank', `${badgeEmojis[userProfile.rank]} ${userProfile.rank}`, true);
        embed.addField('Skills', userProfile.skills.length > 0 ? userProfile.skills.join(', ') : 'No skills', false);
        embed.addField('Notes', userProfile.notes.length > 0 ? userProfile.notes.join('\n') : 'No notes', false);

        // Add progress bar
        const progressBar = generateProgressBar(userProfile.xp, 1500, 10);
        embed.addField('XP Progress', progressBar, false);
    } else {
        embed.setDescription('User profile not found.');
    }

    message.channel.send({ embeds: [embed] });
}



async function setSkills(message, args) {
    const user = message.author;
    const skills = args.join(' ').split(',').map(skill => skill.trim());
    
    const userProfile = await loadOrCreateUserProfile(user.id);
    userProfile.skills = skills;
    
    await saveUserProfile(userProfile);
    message.reply('Skills updated successfully!');
}

async function setRank(message, args) {
    const user = message.author;
    const rank = args.join(' ');
    
    if (!Object.keys(badgeEmojis).includes(rank)) {
        return message.reply('Invalid rank name. Choose from: Beginner, Intermediate, Advanced.');
    }
    
    const userProfile = await loadOrCreateUserProfile(user.id);
    userProfile.rank = rank;
    
    await saveUserProfile(userProfile);
    message.reply(`Rank set to ${rank} successfully!`);
}

async function setNotes(message, args) {
    const user = message.author;
    const notes = args.join(' ').split('\n').map(note => note.trim());
    
    const userProfile = await loadOrCreateUserProfile(user.id);
    userProfile.notes = notes;
    
    await saveUserProfile(userProfile);
    message.reply('Notes updated successfully!');
}



module.exports = {
    name: 'userprofile',
    description: 'Display user profile.',
    async execute(message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        displayUserProfile(message, targetUser);
    },
    setSkills,
    setRank,
    setNotes
};

async function addXp(userId, amount) {
    const userProfile = await loadOrCreateUserProfile(userId);
    userProfile.xp += amount;

    const xpNeededForNextLevel = (userProfile.rank === 'Advanced' ? Infinity : (userProfile.xp - 500) % 1000);
    if (xpNeededForNextLevel === 0) {
        userProfile.rank = getNextRank(userProfile.rank);
    }

    await saveUserProfile(userProfile);
}

function getNextRank(currentRank) {
    const ranks = ['Beginner', 'Intermediate', 'Advanced'];
    const currentRankIndex = ranks.indexOf(currentRank);
    return currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : currentRank;
}
