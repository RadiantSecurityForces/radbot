const Discord = require('discord.js');
const axios = require('axios');

// Function to perform IP geolocation
async function performIPGeolocation(ip) {
    const apiKey = 'e79ff05974ff2b68fed7842cf0a4031f2fabd9102e6d027b01bf30614552f3ee';
    const url = `https://ipinfo.io/${ip}/json?token=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        const data = response.data;
        
        // Extract relevant information from the response
        const location = `${data.city}, ${data.region}, ${data.country}`;
        const coordinates = data.loc;
        
        return `IP Address: ${ip}\nLocation: ${location}\nCoordinates: ${coordinates}`;
    } catch (error) {
        console.error('Error performing IP geolocation:', error);
        return 'An error occurred while geolocating the IP address.';
    }
}

module.exports = {
    name: 'ipgeolocate',
    description: 'Perform IP geolocation to find the location of an IP address.',
    async execute(message, args) {
        const ip = args[0];
        if (!ip) {
            return message.reply('Please provide an IP address to geolocate.');
        }

        const result = await performIPGeolocation(ip);
        message.channel.send(result);
    },
};
