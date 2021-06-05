// Command tendril
const Discord = require(`discord.js`);
const Index = require(`../../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const Message = require(`../../events/message`);
const { Cache, Err, Main } = require(`../../utils/Utils`);
const Guilds = require(`../../models/Guilds`);
const Info = {
    not_allowed: [],
    description: `Change the prefix of the server for this bot!\n`,
    help: `Usage: \`<Current-prefix>prefix <New-Prefix>\` **NOTE: Make sure not to use the brackets (< and > signs)!**`
}
const CommandName = 'Prefix';

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
    async call(message) {

        if (!this.initiated) return new Err(`Called ${CommandName} command tendril without message initiation!`);

        // Args
        const args = message.content.toLowerCase().split(/\s/);
        if (!args[1]) return message.reply(`Please mention the prefix to use! \n${Info.help}`);
        const newPref = args[1];
        if (newPref == 'help') {
            // Help module
            message.channel.send(`***__Ping Command__***\n${Info.description}\n${Info.help}`);
            return;
        }
        if (Info.not_allowed.includes(newPref)) return message.reply(`Sorry, but that prefix is not allowed to be used! Please try a different one!`);

        // Getting current guild
        let GuildReq = await Guilds.findOne({ guildId: message.guild.id });
        // Updating guild
        if (!GuildReq) {
            GuildReq = await Guilds.create({
                guildId: message.guild.id,
                guildName: message.guild.name,
                prefix: newPref
            })
        }
        else {
            await GuildReq.updateOne({
                prefix: newPref
            })
        }

        // Updating local cache
        global.prefixes.delete(message.guild.id).then(
            global.prefixes.set(message.guild.id, newPref)
        );

        // Informing
        message.reply(`Updated prefix to \`${newPref}\`!`);

    }
}

const instance = new Command();

// Exports
module.exports = {
    name: CommandName.toLowerCase(),
    description: Info.description,
    useName: CommandName,
    ignore: false,
    guildOnly: true,
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    cooldown: 3,
    color: 'RANDOM',
    help: Info.help,
    call: async (message, client) => {
        if (!instance.initiated) instance.init(client);
        instance.call(message);
    }
}