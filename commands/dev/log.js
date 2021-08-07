// Command tendril
const Discord = require(`discord.js`);
const Index = require(`../../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const Message = require(`../../events/message`);
const { Cache, Err, Main } = require(`../../utils/Utils`);

const CommandName = "Log";

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
    if (!this.initiated)
      return new Err(
        `Called ${CommandName} command tendril without message initiation!`
      );

    const args = message.content.split(/\s/);
    const commandRaw = args.shift();
    const type = args.shift();
    const toLog = args.join(" ");

    if (!type || !toLog)
      return message.reply(
        `Please use the valid format! \`${message.prefix}log <type:dev/build/v13> <To Log>\``
      );

    if (!toLog.includes(":") || !toLog.includes(":-"))
      return message.reply(`Invalid log format!`);

    const title = toLog.split(":-").shift();
    this.InLog({ title, toLog });
    const additions = toLog.split(":-")[1];
    let array = [];
    this.InLog(additions);
    additions
      .split(":")
      .slice(1)
      .forEach((add) => {
        const typeAddition = add.substr(0, 1);
        const addition = add.substr(1, add.length);
        switch (typeAddition.toLowerCase()) {
          case "a":
            array.push(`${this.e.new}${addition}`);
            break;
          case "r":
            array.push(`${this.e.remove}${addition}`);
            break;
          case "f":
            array.push(`${this.e.bug2}${addition}`);
            break;
          case "t":
            array.push(`${this.e.tic}${addition}`);
            break;
          default:
            array.push(`${this.e.dev}${addition}`);
            break;
        }
      });

    const logChannel = this.client.channels.cache.get(
      this.config.Dev.logs_channel
    );

    if (!logChannel) {
      this.cache.push(
        new Cache("Tried logging without log channel", {
          message_content: message.content,
          logChannel,
          channelId: this.config?.Dev?.logs_channel,
        })
      );
    }

    let typeSend;
    switch (type.toLowerCase()) {
      case "dev":
        typeSend = this.e.yarn;
        break;
      case "build":
        typeSend = this.e.hype;
        break;
      case "v13":
        typeSend = this.e.partner;
        break;
      default:
        typeSend = this.e.hype;
        break;
    }

    const date = new Date();
    logChannel
      .send(
        `***[${date.toLocaleDateString()}@${date.toLocaleTimeString()}]*** \n\n` +
          `${typeSend} __${title}__ \n` +
          array.join("\n") +
          `\n\n` +
          `===================================`
      )
      .then((msg) => {
        message.channel.send(`${this.e.r} Logged!`);
      });
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
  permissions: ["DEV"],
  cooldown: 3,
  color: "RANDOM",
  extraFields: [],
  help: CommandName,
  call: async (message, client) => {
    if (!instance.initiated) instance.init(client);
    instance.call(message);
  },
};
