const Discord = require('discord.js')
module.exports.run = async(client, msg, args, servidores) => {
    const quant = servidores[msg.guild.id].fila.length
    servidores[msg.guild.id].loopIn = false
    servidores[msg.guild.id].loopM = false
    servidores[msg.guild.id].fila = []
    servidores[msg.guild.id].titulo = []
    servidores[msg.guild.id].requisitado = []
    servidores[msg.guild.id].loop = []
    servidores[msg.guild.id].lotitulo = []
    servidores[msg.guild.id].lorequisitado = []
    const embed = new Discord.MessageEmbed()
        .setColor([0,132,218])
        .setAuthor(`Retirei ${quant} músicas`, 'https://i.imgur.com/EUkGtOK.png')
    msg.channel.send(embed)
        .then((embedMessage) => {
            embedMessage.delete({timeout: 4000}).catch(O_o => {})
        })
}