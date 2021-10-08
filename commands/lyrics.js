const lyricsFinder = require('lyrics-finder')
const Discord = require('discord.js');

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    var tituloori = servidores[msg.guild.id].titulo[0]
    var titulo = servidores[msg.guild.id].titulo[0]
    if (titulo.indexOf('[')) {
        var quant = titulo.indexOf('[')
        var tirar = titulo.slice(quant)
        var titulo = titulo.replace(tirar, '')
    }
    if (titulo.indexOf('(')) {
        var quant = titulo.indexOf('(')
        var tirar = titulo.slice(quant)
        var titulo = titulo.replace(tirar, '')
    }
    if (titulo.indexOf('{')) {
        var quant = titulo.indexOf('{')
        var tirar = titulo.slice(quant)
        var titulo = titulo.replace(tirar, '')
    }
    try {
        let lyrics = await lyricsFinder(titulo) || "Not Found!";
        if (lyrics.length > 4096) {
            msg.channel.send('No momento, não consigo mostrar letras de música com mais de 4096 caracteres.')
        }
        else if (lyrics === 'Not Found!'){
            msg.channel.send('Não encontrei uma letra para esse conteúdo.')
        }
        else {
        const lyricEmbed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setTitle(tituloori)
            .setDescription(lyrics)
            .setFooter('Letras fornecidas por lyrics-finder')
        msg.channel.send(lyricEmbed)
        }
        
    } catch (error) {
        console.log(error)
    }
}