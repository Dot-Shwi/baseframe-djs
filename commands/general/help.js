// Command tendril
const Discord = require(`discord.js`);
const Index = require(`../../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const Message = require(`../../events/message`);
const { Cache, Err, Main } = require(`../../utils/Utils`);
const { help } = require("../dev/$command.base");

const CommandName = 'help';

class Command extends Message.Event {

    /**
     * Create command
     */
    constructor() {
        super(CommandName);
    }

    /**
   * 
   * @param {Discord.Client} client 
   */
    init(client) {
        if (this.initiated) return;
        this.client = client;
        this.initiated = true;
    }

    /**
     * Call this command using message
     * @param {Discord.Message} message 
     */
    call(message) {

        if (!this.initiated) return new Err(`Called ${CommandName} command tendril without message initiation!`);

        const args = message.content.toLowerCase().split(/\s/);
        const commandRaw = args.shift();
        if (args[0]) {
            const commandToFind = args[0];
            const command = this.client.commands.find(cmd => cmd.name.includes(commandToFind) || cmd.aliases && cmd.aliases.includes(commandToFind));
            if (!command) return message.channel.send(`No such command found!`).then(msg => { msg.delete({ timeout: 5000 }); message.delete({ timeout: 5000 }) });
            let canContinue = 'yeh';
            for (let p = 0; p < command.permissions; p++) {
                if (command.permissions[p] == "DEV") {
                    if (!message.isDev) canContinue = 'noh';
                    continue;
                }
                if (!message.member.hasPermission(command.permissions[i])) canContinue = "noh";
            }
            if (!canContinue) return message.channel.send(`You do not have enough permissions to use that command!`).then(msg => { msg.delete({ timeout: 5000 }); message.delete({ timeout: 5000 }) });
            const commandHelpEmbed = new Discord.MessageEmbed()
                .setTitle(command.useName)
                .setDescription(command.description)
                .setColor(command.color)
                .addField("Guild only?", command.guildOnly, true)
                .addField("Cooldown", command.cooldown, true)
                .addField("Aliases", command.aliases.length > 0 ? command.aliases.join(", ") : "No aliases", true)
                .addField("More information", command.help)
                .setFooter(`Requested by ${message.author.tag}`)
                .setTimestamp();
            const commandExtras = command.extraFields || [];
            if (commandExtras.length > 0) commandHelpEmbed.addFields(command.extraFields);
            message.channel.send(commandHelpEmbed);
            return;
        }

        const helpEmbed = new Discord.MessageEmbed()
            .setTitle(`Help is here!`)
            .setDescription(`Here are all my commands! The prefix for the server is \`${message.prefix}\``)
            .setColor(`RANDOM`)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`);

        const commandCats = fs.readdirSync(`./commands`);
        for (const cat of commandCats) {
            let allcmds = [];
            const commandFiles = fs.readdirSync(`./commands/${cat}`).filter(file => file.endsWith(`.js`) && !file.startsWith(`$`));
            for (const file of commandFiles) {
                const command = require(`../../commands/${cat}/${file}`);
                command.status = 'yeh';
                let commandPerms = command.permissions || ["SEND_MESSAGES"];
                for (let i = 0; i < commandPerms.length; i++) {
                    if (commandPerms[i] == 'DEV') {
                        if (!message.isDev) command.status = 'noh';
                        continue;
                    }
                    if (!message.member.hasPermission(commandPerms[i])) command.status = 'noh';
                }
                if (command.status !== 'noh') allcmds.push(command.useName);
            }
            let catName = cat.substr(0, 1).toUpperCase() + cat.substr(1, cat.length - 1);
            if (allcmds.length !== 0) helpEmbed.addField(catName, allcmds.join(`, `), true);
        }

        // Other info
        helpEmbed.addField(`Other information`, `**Devs:** <@${this.config.Bot.devs.join(`>, <@`)}> \n[**Invite**](https://discord.com/api/oauth2/authorize?client_id=870329762722238505&permissions=8&redirect_uri=https%3A%2F%2Fwww.discord.com%2Fapp&response_type=code&scope=bot%20messages.read)`)

        message.channel.send(helpEmbed);

    }
}

const instance = new Command();

// Exports
module.exports = {
    name: CommandName.toLowerCase(),
    description: CommandName,
    useName: CommandName,
    ignore: false,
    guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    cooldown: 3,
    color: 'RANDOM',
    help: CommandName,
    call: async (message, client) => {
        if (!instance.initiated) instance.init(client);
        instance.call(message);
    }
}