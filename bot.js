const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;

fs.readdir('./cmds/', (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) console.log("no commands to load!!");
    console.log(`Loaded ${jsfiles.length} command(s)`);
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Loaded!`);
        client.commands.set(props.help.name, props);
    });
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('message', async message => {
    if (message.author.bot) return; 
    if (message.chanel.type == "dm") return; 
    let user = message.author.username;
    let userid = message.author.id;
    let messageArray = message.content.split(" "); 
    let command = messageArray[0].toLowerCase(); 
    let args = messageArray.slice(prefix.lenght); 
    if (!message.content.startsWith(prefix)) return; 
    let cmd = client.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);
