const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const google = require('googleapis')
module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {

    const tocaMusicas = (msg) => {
        if (servidores[msg.guild.id].estouTocando === false) {
            const tocando = servidores[msg.guild.id].fila[0]
            servidores[msg.guild.id].estouTocando = true
            servidores[msg.guild.id].dispatcher = servidores[msg.guild.id].connection.play(ytdl(tocando, configs.YTDL))
            
            servidores[msg.guild.id].dispatcher.on('finish', () => {
                servidores[msg.guild.id].fila.shift()
                servidores[msg.guild.id].titulo.shift()
                servidores[msg.guild.id].requisitado.shift()
                servidores[msg.guild.id].estouTocando = false
                if (servidores[msg.guild.id].fila.length > 0) {
                    tocaMusicas(msg)
                } 
                else {
                    servidores[msg.guild.id].dispatcher = null
                }
            })
        }
    }


    let oQueTocar = msg.content.slice(8)

    if (oQueTocar.length === 0) {
        msg.channel.send('Não tem nada arrombado!')
        
    }

    if (servidores[msg.guild.id].connection === null) {
        try {
            servidores[msg.guild.id].connection = await msg.member.voice.channel.join();
        } catch (err) {
            console.log('Erro ao entrar num canal de voz!')
            console.log(err)
        }
    }

    if (ytdl.validateURL(oQueTocar)) {
        let songInfo = null
        let song = null
        try {
            songInfo = await ytdl.getInfo(oQueTocar)
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            }
        } catch (error) {
            console.error(error)
        }

        servidores[msg.guild.id].titulo.push(song.title)
        servidores[msg.guild.id].fila.push(oQueTocar)
        servidores[msg.guild.id].requisitado.push(requerente)
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Adicionado à fila', 'https://i.imgur.com/EUkGtOK.png')
            .setTitle(`${song.title}`)
            .setURL(`${song.url}`)
            .setDescription(`Requisitado por **${requerente}**`)
        msg.channel.send(embed)
        console.log('Adicionado: ' + oQueTocar)
        tocaMusicas(msg)
    }
    else {
        youtube.search.list({
            q: oQueTocar,
            part: 'snippet',
            fields: 'items(id(videoId),snippet(title,channelTitle))',
            type: 'video'
        }, function (err, resultado) {
            if (err) {
                console.log(err)
            }
            if (resultado) {
                const listaResultado = []

                // organiza o resultado da pesquisa
                for (let i in resultado.data.items) {
                    const montaItem = {
                        'tituloVideo': resultado.data.items[i].snippet.title,
                        'nomeCanal': resultado.data.items[i].snippet.channelTitle,
                        'id': 'https://www.youtube.com/watch?v=' + resultado.data.items[i].id.videoId
                    }

                    listaResultado.push(montaItem)
                }
                // Constrói a mensagem embed
                const embed = new Discord.MessageEmbed()
                    .setColor([0,132,218])
                    .setAuthor("Indigena's bot", 'https://cdn.discordapp.com/avatars/847868544581894205/65cf463c21da7876a0209dd035197fa0.png?size=128')
                    .setDescription('Escolha a sua música de 1-5 !')

                // adiciona campos pra cada resultado da lista
                for (let i in listaResultado) {
                    embed.addField(
                        `${parseInt(i) + 1}: ${listaResultado[i].tituloVideo.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}`, 
                        listaResultado[i].nomeCanal
                    )
                }

                msg.channel.send(embed)
                    .then((embedMessage) => {
                        const possiveisReacoes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

                        // reage na mensagem pra cada emoji que escolhemos
                        for (let i = 0; i < possiveisReacoes.length; i++){
                            embedMessage.react(possiveisReacoes[i])
                        }

                        const filter = (reaction, user) => {
                            return possiveisReacoes.includes(reaction.emoji.name) 
                                && user.id === msg.author.id
                        }

                        embedMessage.awaitReactions(filter, {max: 1, time: 30000, erros: ['time']})
                            .then((collected) => {
                                const reaction = collected.first()
                                const idOpcaoEscolhida = possiveisReacoes.indexOf(reaction.emoji.name)
                                const embednovo = new Discord.MessageEmbed()
                                    .setColor([0,132,218])
                                    .setAuthor('Adicionado à fila', 'https://i.imgur.com/EUkGtOK.png')
                                    .setURL(`${listaResultado[idOpcaoEscolhida].id}`)
                                    .setTitle(`${listaResultado[idOpcaoEscolhida].tituloVideo.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}`)
                                    .setDescription(`Requisitado por **${requerente}**`)
                                msg.channel.send(embednovo)

                                servidores[msg.guild.id].titulo.push(listaResultado[idOpcaoEscolhida].tituloVideo.replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
                                servidores[msg.guild.id].fila.push(listaResultado[idOpcaoEscolhida].id)
                                servidores[msg.guild.id].requisitado.push(requerente)
                                tocaMusicas(msg)
                                console.log('Adicionado: ' + listaResultado[idOpcaoEscolhida].id)
                            }).catch((error) => {
                                msg.reply('você não escolheu uma opção válida')
                                console.log(error)
                            })
                    })

            }
        })
    }           
}