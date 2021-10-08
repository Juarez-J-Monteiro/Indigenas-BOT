const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (servidores[msg.guild.id].connection === null || servidores[msg.guild.id].dispatcher === null) {
        msg.channel.send('Não estou tocando nada!')
    } else {
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Pausado', 'https://i.imgur.com/HS6FK4X.png')
        msg.channel.send(embed)
            .then((embedMessage) => {
                embedMessage.delete({timeout: 4000}).catch(O_o => {})
            })
        servidores[msg.guild.id].dispatcher.pause()
    }
}