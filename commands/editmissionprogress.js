// commands/editmissionprogress.js
const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = 
{
    name: 'editmissionprogress',
    description: 'Edit the progress of a mission.',
    async execute(message, args) 
    {
        const missionTitle = args[0];
        const newProgress = parseInt(args[1]);

        if (!missionTitle || isNaN(newProgress)) 
        {
            return message 
        }
        
        
        
 
    }
}