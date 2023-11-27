// commands/reboot.js
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
// const client = new Discord.Client();

module.exports = {
  name: 'reboot',
  description: 'Easily reboot the bot',
  async execute(message, args, client) {
   //if (message.guild.id === '1110594019442036817') {
      //if(message.member.roles.cache.has('1142842638677053580')) {
        console.log('working');
        reboot();
      //}
    //} else {
    //  const notingoodserver = new Discord.MessageEmbed()
    //    .setColor('#0099ff')
    //    .setTitle('Please execute this command in the radiance playground server!')
    //  message.channel.send({ embeds: [notingoodserver] });
    //}
    function reboot() {
      message.channel.send('rebooting...')
      .then(()=>client.destroy()) // <<<<
      .then(()=>client.login(config.token)) // <<<<
      //console.log('succesfully rebooted');
    }
  }
}
