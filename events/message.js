// Event base
const Discord = require(`discord.js`);
const Index = require(`../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const { Cache, Err, Main } = require(`../utils/Utils`);
const Guilds = require(`../models/Guilds`);

const EventName = 'message';

class Event extends Index.EntryPoint {
    /**
     * Create event
     */
    constructor(command) {
        command = command ? `.${command}` : "";
        super(`event.${EventName}${command}`);
        this.initiated = false;
        this.config = require(`../store/config.json`);
    }

    /**
     * Initiate this event with client
     * @param {Discord.Client} client 
     */
    async init(client) {
        if (this.initiated) return;
        this.client = client;
        this.client.cooldowns = new Discord.Collection();
        global.prefixes = new Discord.Collection();

        // Loading commands
        this.client.commands = new Discord.Collection();
        const commandFolders = fs.readdirSync(`./commands/`);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(file => file.endsWith(`.js`));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                this.client.commands.set(command.name, command);
                this.cache.push(new Cache(`Loaded command "${command.name}" in category "${folder}".`).Log());
            }
        }
        this.initiated = true;

        // Mongoose
    }

    /**
     * Call the event 
     * @param {Discord.Message} message
     */
    call(message) {

        if (!this.initiated) return new Err(`Called ${EventName} event without initialisation!`);
        if (!message) return new Err(`Called message event without a message!`);
        if (message.author.bot) return;

        // Message args
        const msg = message.content.toLowerCase();
        const args = msg.split(/\s/);
        if (this.config.Bot.devs.includes(message.author.id)) message.isDev = true
        else message.isDev = false;

        message.status = 'continue';
        // Search for prefix
        if (!global.prefixes.get(message.guild.id)) {
            message.guildDB = await Guilds.findOne({ guildId: message.guild.id });
            if (!message.guildDB) {
                message.guildDB = await Guilds.create({
                    guildId: message.guild.id,
                    guildName: message.guild.name
                })
            }
            message.prefix = await message.guildDB.get('prefix') || this.config.Bot.prefix;
            global.prefixes.set(message.guild.id, message.prefix);
        } else {
            message.prefix = global.prefixes.get(message.guild.id);
        }
        // Permissions and pref
        let req = args.shift();
        if (!req.startsWith(message.prefix)) return;
        req = req.slice(message.prefix.length);
        const res = this.client.commands.get(req) || this.client.commands.find(c => c.aliases && c.aliases.includes(req));
        if (!res || res.ignore) return;
        const perms = res.permissions || ["SEND_MESSAGES"];
        if (res.guildOnly && !message.guild) return;
        for (let i = 0; i < perms.length; i++) {
            if (perms[i] == 'DEV') {
                if (!message.isDev) message.status = 'stop';
                continue;
            }
            if (message.guild) {
                if (!message.member.hasPermission(perms[i])) message.status = 'stop';
            }
        }
        if (message.status == 'stop') return;

        // Cooldowns
        /**
         * @param {Discord.Collection} cooldowns
         */
        const { cooldowns } = this.client;
        if (!cooldowns.has(res.name)) {
            cooldowns.set(res.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(res.name);
        const cooldownAmount = (res.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {

            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the ${res.name} command!`);
            }

        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Carry command
        res.call(message, this.client);



    }
}

const Instance = new Event();

// Exports
module.exports = {
    name: EventName,
    call: (client, message) => {

        // Call event
        if (!Instance.initiated) Instance.init(client);

        Instance.call(message);

    },
    Event,
    Instance
}