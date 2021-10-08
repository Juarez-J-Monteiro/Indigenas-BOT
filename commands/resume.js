const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (servidores[msg.guild.id].connection === null || servidores[msg.guild.id].dispatcher === null) {
        msg.channel.send('Não estou tocando nada!')
    } else {
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Tocando', 'https://i.imgur.com/cRaWRS0.png')
        msg.channel.send(embed)
            .then((deleteEmbed) => {
                deleteEmbed.delete({timeout:4000}).catch(O_o => {})
            })
        servidores[msg.guild.id].dispatcher.resume()
    }
}