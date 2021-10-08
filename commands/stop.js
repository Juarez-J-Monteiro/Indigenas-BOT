const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (servidores[msg.guild.id].estouTocando === false || servidores[msg.guild.id].dispatcher === null) {
        msg.channel.send('Não estou tocando nada!')
    }
    else {
        servidores[msg.guild.id].dispatcher.pause()
        servidores[msg.guild.id].fila = []
        servidores[msg.guild.id].titulo = []
        servidores[msg.guild.id].requisitado = []
        servidores[msg.guild.id].loop = []
        servidores[msg.guild.id].lotitulo = []
        servidores[msg.guild.id].lorequisitado = []
        servidores[msg.guild.id].dispatcher = null
        servidores[msg.guild.id].estouTocando = false
        servidores[msg.guild.id].connection = null
        msg.member.voice.channel.leave()
    }
    
}