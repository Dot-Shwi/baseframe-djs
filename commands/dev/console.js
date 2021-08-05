// Command tendril
const Discord = require(`discord.js`);
const Index = require(`../../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const Message = require(`../../events/message`);
const {
    Cache,
    Err,
    Main
} = require(`../../utils/Utils`);

const CommandName = 'Console';

class Command extends Message.Event {

    /**
     * Create command
     */
    constructor() {
        super(CommandName);
        this.inSession = false;
        this.sessions = [];
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

        if(args[0] == "stop") {
            if(this.endSession(message)) {
              //do nothing?
            }
            
          else message.channel.send(`No session going on!`);
          return;
        }
        const time = args[0] ? !isNaN(parseFloat(args[0])) ? parseFloat(args[0]) * 1000 : 120 * 1000 : 120 * 1000;

        if(this.startSession(time, message)) {
          const collector = new Discord.MessageCollector(message.channel, u => u.author.id == message.author.id && this.inSession, {time: time});
          collector.on("collect", msg => {
            if(!this.inSession) return;
            const toParse = msg.content;
            let toProcess;
            
            if(toParse.startsWith("```")) {
              toProcess = toParse.substr(toParse.indexOf("\n") + 1, toParse.lastIndexOf("\n") - toParse.indexOf("\n"));
            }
            else {
              toProcess = toParse;
            }
            this.InLog({toParse, toProcess});
            this.cache.push(new Cache(`Console parsing \n${toProcess}`, {toParse, toProcess}));
            try {
              eval(toProcess);
            }
            catch(error) {
              if(error) {
                const err = new Err(error, "EVAL-ERROR", {toParse, toProcess});
                message.channel.send(`:x: Could not evaluate! Please check logs! \n[${err.code}]-${err.info.id}`);
              }
            }
          })
        }
        else return message.channel.send(`Already a session going on!`);

    }

    endSession(message) {
      if(this.inSession) {
        this.cache.push(new Cache(`Ended session for dev console!`, {time: new Date(), stamp: Date.now(), locale: new Date().toLocaleString()}).Log());
        this.inSession = false;
        message.channel.send(`Ended console session! **Session ID: ${this.sessions[this.sessions.length - 1]}**!`)
        return true;
      }
      else return false;
    }

    startSession(receivedTime, message) {
      if(!this.inSession) {
        const time = new Date();
        this.cache.push(new Cache(`Started session for dev console! At: ${time.toLocaleString()}`, {time: time, stamp: time.toUTCString(), locale: time.toLocaleString()}).Log());
        this.inSession = true;
        const sessionId = this.sessions.push(this.sessions.length + 1);
        message.channel.send(`Started console session for ${receivedTime/1000} second(s)! **Session ID: ${sessionId}**`);
        setTimeout(() => {
          this.endSession(message);
        }, receivedTime)
        return true;
      }
      else return false;
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
    aliases: ["cns"],
    permissions: ['DEV'],
    cooldown: 3,
    color: 'RANDOM',
    extraFields: [],
    help: CommandName,
    call: async (message, client) => {
        if (!instance.initiated) instance.init(client);
        instance.call(message);
    }
}