const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')
const scrapper = require('youtube-scrapper')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (servidores[msg.guild.id].nowPlaying == '') {
        msg.channel.send('Não estou tocando nada!')
    }
    else {
        const searchResults = await scrapper.getVideoInfo(servidores[msg.guild.id].nowPlaying)
        const titles = searchResults.info.title
        const url = searchResults.info.url
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Reproduzindo', 'https://i.imgur.com/cRaWRS0.png')
            .setTitle(titles)
            .setURL(url)
            .setDescription(`Música requisitada por **${servidores[msg.guild.id].SaveRequisitado}**`)
        msg.channel.send(embed)
    }

}