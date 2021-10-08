const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (!servidores[msg.guild.id].fila.length > 0) {
        msg.channel.send('Não estou tocando nada!')
    }
    else {
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Reproduzindo', 'https://i.imgur.com/cRaWRS0.png')
            .setTitle(`${servidores[msg.guild.id].titulo[0]}`)
            .setURL(`${servidores[msg.guild.id].fila[0]}`)
            .setDescription(`Música requisitada por **${servidores[msg.guild.id].requisitado[0]}**`)
        msg.channel.send(embed)
    }

}