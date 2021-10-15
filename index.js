const Discord = require('discord.js')
const configs = require('./config.json')
const google = require('googleapis')
const fs = require('fs');

//algumas coisas pro bot ficar on direto
/*ar express = require('express');
var app = express();
const http = require('http');

app.get("/", (request, response) => {
  response.sendStatus(200); //responde qdo recebe ping
  console.log("fui pingado!");
});
app.listen(process.env.PORT);*/

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: configs.GOOGLE_KEY
})
const client = new Discord.Client({
    presence: {
     status: 'online',
     activity: {
      name: `${configs.PREFIX}help`,
      type: 'LISTENING',
     },
    },
})

const prefixo = configs.PREFIX;

const servidores = []

client.on("guildCreate", (guild) => {
    console.log('Id da guilda onde eu entrei: ' + guild.id)
    console.log('Nome da guilda onde eu entrei: ' + guild.name)

    servidores[guild.id] = {
        connection: null,
        dispatcher: null,
        nowPlaying: '',
        SaveRequisitado: '',
        titulo: [],
        lotitulo: [],
        disp: false,
        loopIn: false,
        loopM: false,
        requisitado: [],
        lorequisitado: [],
        fila: [],
        canal: [],
        loop: [],
        estouTocando: false
    }

    saveServer(guild.id)
})

client.on("ready", () => {
    loadServers()
    console.log('Estou online!');
});

var change = false
function changeAct() {
    if (change === false) {
        client.user.setActivity(`Spotify playlists are now supported!`, {type: 'PLAYING'})
        change = true
    }
    else {
        client.user.setActivity(`${configs.PREFIX}help`, {type: 'LISTENING'})
        change = false
    }
}
setInterval(changeAct, 10000)

client.on("message", async (msg) => {

    // filtro

    if (!msg.guild) return

    if(msg.author.bot) return

    if (!msg.content.startsWith(prefixo)) return

    if (!msg.member.voice.channel) {
        if (msg.content === prefixo + 'help'){
            
        }
        else {
            msg.channel.send('Entre em um canal de voz!')
        }
    }

    if (msg.content[1] == prefixo) return

    let requerente = msg.author.username

    const args = msg.content.trim()
        .slice(prefixo.length)
        .split(/ +/g)
    const command = args.shift().toLowerCase()

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, msg, args, servidores, prefixo, youtube, requerente, configs)
    } catch (err) {
        msg.channel.send('Esse comando não está em minha lista!')
    }

});

const loadServers = () => {
    fs.readFile('serversList.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Erro 1701 ao ler o arquivo')
            console.log(err)
        }
        else {
            const objLe = JSON.parse(data)
            for (let i in objLe.servers) {
                servidores[objLe.servers[i]] = {
                    connection: null,
                    dispatcher: null,
                    nowPlaying: '',
                    SaveRequisitado: '',
                    titulo: [],
                    lotitulo: [],
                    disp: false,
                    loopIn: false,
                    loopM: false,
                    requisitado: [],
                    lorequisitado: [],
                    fila: [],
                    canal: [],
                    loop: [],
                    estouTocando: false
                }
            }
        }    
    })
}

const saveServer = (idNovoServidor) => {
    fs.readFile('serversList.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Erro 1700 ao ler o arquivo')
            console.log(err)
        }
        else {
            const objLe = JSON.parse(data)
            objLe.servers.push(idNovoServidor)
            const objEscreve = JSON.stringify(objLe)

            fs.writeFile('serversList.json', objEscreve, 'utf8', () => {})
        }
    })
}

client.login(configs.TOKEN_DISCORD);