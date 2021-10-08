const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
const Discord = require('discord.js');
const google = require('googleapis')
const { getData, getPreview, getTracks } = require('spotify-url-info')
const scrapper = require('youtube-scrapper')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {

    let oQueTocar = msg.content.slice(6)

    const tocaMusicas = (msg) => {
        if (servidores[msg.guild.id].estouTocando === false) {
            const tocando = servidores[msg.guild.id].fila[0]
            servidores[msg.guild.id].estouTocando = true
            servidores[msg.guild.id].dispatcher = servidores[msg.guild.id].connection.play(ytdl(tocando, configs.YTDL))

            servidores[msg.guild.id].dispatcher.on('finish', () => {
                if (servidores[msg.guild.id].loopM === false || servidores[msg.guild.id].loopIn === false) {
                    servidores[msg.guild.id].fila.shift()
                    servidores[msg.guild.id].titulo.shift()
                    servidores[msg.guild.id].requisitado.shift()
                }
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

    if (oQueTocar.length === 0) {
        msg.channel.send('Não tem nada arrombado!')
            return
    }

    if (servidores[msg.guild.id].connection === null) {
        try {
            servidores[msg.guild.id].connection = await msg.member.voice.channel.join()
        }
        catch (err) {
            console.log('Erro ao entrar num canal de voz!')
            console.log(err)
        }
    }

    if (oQueTocar.startsWith('https://open.spotify.com/playlist/')) {
        let nomePlay = ''
        const listaResultado = []
        await getPreview(oQueTocar)
            .then(data => {
                nomePlay = data.title
            })
        var quant = 0
        await getTracks(oQueTocar)
            .then(data => {
                //console.log(data)
                for (i in data) {
                    quant = quant + 1
                    const montaItem = {
                        'tituloVideo': data[i].name,
                        'artista': data[i].artists[0].name
                    }
                    listaResultado.push(montaItem)
                    if (quant >= 50) {
                        break
                    }
                }
            })
        
        const temp = parseInt(listaResultado.length)*900
        msg.channel.send('Adicionando músicas à fila...')
            .then((mms) => {
                mms.delete({timeout: temp}).catch(O_o => {})
            })
        
        for (i in listaResultado) {
            const searchResults = await scrapper.search(`${listaResultado[i].tituloVideo} ${listaResultado[i].artista}`)
            const urls = searchResults.videos.map(vid => vid.url)
            const titles = searchResults.videos.map(vid => vid.title)
            servidores[msg.guild.id].fila.push(urls[0])
            servidores[msg.guild.id].titulo.push(titles[0])
            servidores[msg.guild.id].requisitado.push(requerente)
            tocaMusicas(msg)
            console.log('Adicionado: ' + urls[0])
        }
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor(`Playlist adicionada à fila (${quant} músicas)`, 'https://i.imgur.com/EUkGtOK.png')
            .setTitle(`${nomePlay}`)
            .setURL(`${oQueTocar}`)
            .setDescription(`Requisitado por **${requerente}**`)

        msg.channel.send(embed)
    }
    else if (oQueTocar.startsWith('https://www.youtube.com/playlist?list=')) {
        const playId = oQueTocar.slice(38)

        youtube.playlistItems.list({
            part: 'snippet',
            maxResults: 50,
            playlistId: playId,
            fields: "items(snippet(resourceId(videoId),title,thumbnails(medium(url)),channelTitle))"
        }, function (err, resultado) {
            if (err) {
                console.log(err)
            }
            if (resultado) {
                const listaResultado = []
                // organiza o resultado da pesquisa
            
                var quant = 0

                for (let i in resultado.data.items) {
                    const montaItem = {
                        'tituloVideo': (resultado.data.items[i].snippet.title).replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
                        'nomeCanal': resultado.data.items[i].snippet.channelTitle,
                        'id': 'https://www.youtube.com/watch?v=' + resultado.data.items[i].snippet.resourceId.videoId
                    
                    }
                    listaResultado.push(montaItem)
                }
            
                for (let i in listaResultado) {
                    servidores[msg.guild.id].fila.push(listaResultado[i].id)
                    servidores[msg.guild.id].titulo.push((listaResultado[i].tituloVideo))
                    servidores[msg.guild.id].requisitado.push(requerente)
                    tocaMusicas(msg)
                    console.log('Adicionado: ' + listaResultado[i].id)
                        var quant = quant + 1
                    }

                youtube.playlists.list({
                    part: 'snippet',
                    id: playId,
                    fields: 'items(snippet(title))'
                }, function (err, resultado2) {
                    if (err) {
                        console.log(err)
                    }
                    if (resultado2) {
                        const titulo = resultado2.data.items[0].snippet.title
                        const embed = new Discord.MessageEmbed()
                            .setColor([0,132,218])
                            .setAuthor(`Playlist adicionada à fila (${quant} músicas)`, 'https://i.imgur.com/EUkGtOK.png')
                            .setTitle(`${titulo}`)
                            .setURL(`${'https://www.youtube.com/playlist?list=' + playId}`)
                            .setDescription(`Requisitado por **${requerente}**`)
                        msg.channel.send(embed)
                    }
                })

            }
        })
    } 
    else if (ytdl.validateURL(oQueTocar)) {
        let songInfo = null
        let song = null
        try {
            songInfo = await ytdl.getInfo(oQueTocar)
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                thumb: songInfo.videoDetails.thumbnails[4].url
            }
        } catch (error) {
            console.error(error)
        }
        console.log(song.thumb)
        servidores[msg.guild.id].titulo.push(song.title)
        servidores[msg.guild.id].fila.push(oQueTocar)
        servidores[msg.guild.id].requisitado.push(requerente)
        const embed = new Discord.MessageEmbed()
            .setColor([0,132,218])
            .setAuthor('Adicionado à fila', 'https://i.imgur.com/EUkGtOK.png')
            .setThumbnail(song.thumb)
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
            fields: 'items(id(videoId),snippet(title,thumbnails(medium(url))))',
            type: 'video'
        }, function (err, resultado) {
            if (err) {
                console.log(err)
            }
            if (resultado) {
                const id = resultado.data.items[0].id.videoId
                let thumb = resultado.data.items[0].snippet.thumbnails.medium.url
                let titulo = (resultado.data.items[0].snippet.title).replace(/&quot;/g, '"').replace(/&#39;/g, "'")
                oQueTocar = 'https://www.youtube.com/watch?v=' + id
                servidores[msg.guild.id].fila.push(oQueTocar)
                servidores[msg.guild.id].requisitado.push(requerente)
                servidores[msg.guild.id].titulo.push(titulo)
                tocaMusicas(msg)
                console.log('Adicionado: ' + oQueTocar)
                //constrói a mensagem embed
                const embed = new Discord.MessageEmbed()
                    .setColor([0,132,218])
                    .setAuthor('Adicionado à fila', 'https://i.imgur.com/EUkGtOK.png')
                    .setThumbnail(thumb)
                    .setTitle(`${titulo}`)
                    .setURL(`${oQueTocar}`)
                    .setDescription(`Requisitado por **${requerente}**`)
                msg.channel.send(embed)
            }
        })
    }
}