const Discord = require('discord.js')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    const embed = new Discord.MessageEmbed()
        .setColor([0,132,218])
        .setAuthor("Indigena's bot", 'https://cdn.discordapp.com/avatars/847868544581894205/65cf463c21da7876a0209dd035197fa0.png?size=128')
        .setTitle('Fila atual')
    if (servidores[msg.guild.id].loopIn === true) {
            embed.setTitle('Fila atual (Loop de fila ativado)')
            for (let i in servidores[msg.guild.id].loop) {
                embed.addField(`${parseInt(i)+1} - ${servidores[msg.guild.id].lotitulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].lorequisitado[i]}**`)
            }
        msg.channel.send(embed)
    }
    else if (servidores[msg.guild.id].loopM === true) {
        embed.setTitle('Fila atual (Loop de música ativado)')
        for (let i in servidores[msg.guild.id].fila) {
            if (parseInt(i) === 0) {
                embed.addField(`Tocando agora - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
            }
            else {
                embed.addField(`${parseInt(i)} - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
            }
        }
        msg.channel.send(embed)
    }
    else {
        if (servidores[msg.guild.id].fila < 1) {
            embed.setTitle('NÃO TEM NIGUÉM!')
        }
        else {
            for (let i in servidores[msg.guild.id].fila) {
                if (parseInt(i) === 0) {
                    embed.addField(`Tocando agora - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
                }
                else {
                    embed.addField(`${parseInt(i)} - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
                }
            }
        }
        msg.channel.send(embed)
    }
}
