const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    msg.reply('Mandei na sua DM!')
    const embed = new Discord.MessageEmbed()
        .setColor([0,132,218])
        .setTitle('Comandos')
        .setDescription('Todos os meus comandos:')
        .setAuthor("Indigena's bot", 'https://cdn.discordapp.com/avatars/847868544581894205/65cf463c21da7876a0209dd035197fa0.png?size=128')
        .addFields(
            {name: `${prefixo}join`, value: `Entra no canal de voz do usuário solicitante`},
            {name: `${prefixo}leave`, value: `Sai do canal do voz`},
            {name: `${prefixo}play <link/nome>`, value: `Toca a música com o link ou o nome desejado`},
            {name: `${prefixo}search <nome>`, value: `Pesquisa e retorna os 5 resultados encontrados com o termo pesquisado`},
            {name: `${prefixo}lyrics`, value: `Envia no chat a letra da música que está tocando`},
            {name: `${prefixo}song`, value: `Mostra a música que está tocando no momento`},
            {name: `${prefixo}pause`, value: `Pausa a música atual`},
            {name: `${prefixo}loop`, value: `Coloca a música atual em loop`},
            {name: `${prefixo}qloop`, value: `Coloca a fila atual em loop`},
            {name: `${prefixo}queue`, value: `Mostra a música atual e as próximas 24 músicas`},
            {name: `${prefixo}resume`, value: `Retorna a tocar a música pausada`},
            {name: `${prefixo}skip`, value: `Pula a música atual`},
            {name: `${prefixo}stop`, value: `Para a música e sai do canal de voz`}
        )
    msg.author.send(embed)

}