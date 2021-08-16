/**
 * Main entry point- Discord bot
 * Copyright Shwi 2021
 */

// Require vars
const Discord = require(`discord.js`);
const { Intents } = Discord;
const mongoose = require(`mongoose`);
const Main = require(`./utils/Main`);
const fs = require(`fs`);
const Err = require(`./utils/Err`);
const Cache = require(`./utils/Cache`);
const colors = require(`colors`);
require(`dotenv`).config();
if (!process.env.URL || !process.env.TOKEN)
	return new Err(`(FATAL) Invalid Environmental Variables! Abort!`.bgRed.bold);
// Main class
class EntryPoint extends Main {
	/**
	 * Main entry point for the bot
	 * @param {String} line Line which extends the entrypoint
	 */
	constructor(line) {
		line = line ? `.${line}` : "";
		super(`index` + line);
		this.client = new Discord.Client({
			partials: ["CHANNEL", "MESSAGE", "REACTION"],
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			],
		});
		this.connectedToButton = false;
		this.config = require("./store/config.json");
		this.prevlog = console.log;
		this.toSendCache = [];
		setInterval(() => {
			if (this.toSendCache.length != 0) {
				this.devLog(
					this.toSendCache.length == 1 ? this.toSendCache[0] : this.toSendCache
				);
				this.toSendCache = [];
			}
			if (this.cache.length != 0) {
				const prev = [];
				this.cache.forEach((cach) => {
					prev.push(cach.message);
				});
				this.cache = [];
				this.devLog(prev.length == 1 ? prev[0] : prev);
			}
		}, 5000);

		// Emojis
		this.e = {
			x: "<:no:752721988388126730>",
			r: "<:yes:752721984227508274>",
			tic: "<:blurpleticket:874161306838638592>",
			on: "<:online:874711953266851910>",
			off: "<:offline:874711953245864027>",
			idle: "<:idle:874711953136832604>",
			dev: "<:dev:752721984621772890>",
			dnd: "<:dnd:752721981245358091>",
			bug1: "<:bughunter1:872841410561318952>",
			bug2: "<:bughunter2:872841411119169576>",
			hype: "<:brilliance:874161191520460840>",
			mod: "<:mod:752721983342379028>",
			support: "<:blurplesupport:872133307742167080>",
			line: "<:blurpleline:872133307733778462>",
			cookie: "<:wumpuscookie:752721995954782319>",
			partner: "<:partner:872841412838834256>",
			cozy: "<:wumpuscozy:752721993857499276>",
			i: "<:info:752721989046894693>",
			luv: "<:pikaluv:872841567726108693>",
			gift: "<:blurplegift:872133307737997372>",
			new: ":dart:",
			remove: "📄",
			yarn: "🧶",
			dum: "<:dum:874711954885865483>",
			error: "<:error:874711953182969906>",
			syntax: "<:syntax:874711953535283240>",
			ohno: "<:ohgodohduck:874161386576547880>",
			cool: "<:squirtlecool:874161386257805332>",
			link: "<:blurplelink:874161307170013204>",
			help: "<:blurplesupport:874161307073531914>",
		};

		this.UnknownError = `${this.e.error} An unknown error occured! Please try again!`;
	}

	/**
	 * Start the bot (login using token from environment variables)
	 * Also loads events
	 */
	StartBot() {
		// Start the bot

		// Login client
		this.client.login(process.env.TOKEN);

		// Load events
		fs.readdir(`./events`, "utf-8", (err, files) => {
			if (err) {
				// Found an error
				return new Err(err, `index.${err.code}`, { path: err.path });
			}

			files.forEach((file) => {
				if (!file.endsWith(`.js`)) return;

				// Event
				const event = require(`./events/${file}`);
				this.client.on(event.name, event.call.bind(null, this.client));
				this.cache.push(new Cache(`Loaded event ${event.name}!`).Log());
			});
		});

		this.dev_logs = this.client.channels.cache.get(this.config.Dev.dev_logs);
	}

	/**
	 * Connect to mongoose database using URL from environment variables
	 * @returns {Err} Error if any or null
	 */
	ConnectMongoose() {
		// Connect to mongoose database
		if (!process.env.URL)
			return new Err(`No URL for mongoose provided!`, `MDB-N-URL`).LogErr();
		this.mongo = mongoose.createConnection(process.env.URL, {
			useCreateIndex: true,
			useFindAndModify: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		this.mongoose = mongoose;
		this.cache.push(
			new Cache(`Connected to mongoose!`, {
				mongo: this.mongo,
				mongoose: this.mongoose,
				date: new Date().toLocaleDateString(),
			}).Log()
		);
	}

	SetStatus() {
		if (this.client?.user) {
			this.client.user.setActivity({
				name: "You can do it!",
				type: "COMPETING",
			});
		}
	}

	InLog(...message) {
		this.prevlog(`[${this.name}]:`.yellow, ...message);
		// this.toSendCache = [];
		this.toSendCache = this.toSendCache.slice(
			this.toSendCache.length > 100 ? 100 : 0
		);
		this.toSendCache = [...this.toSendCache, ...message];
	}

	devLog(...message) {
		if (!this.dev_logs)
			this.dev_logs = this.client.channels.cache.get(this.config.Dev.dev_logs);

		const toLog =
			message.length == 1 ? this.jsonify(message[0]) : this.jsonify(message);
		if (this.dev_logs && toLog)
			this.dev_logs.send(
				toLog.trim().substr(0, 1500).split(`\\"`).join("**").split(`"`).join("")
			);
	}

	jsonify(thing, space = 2) {
		return JSON.stringify(thing, null, space);
	}

	Test() {}
}

const entryInstance = new EntryPoint();

entryInstance.StartBot();
entryInstance.ConnectMongoose();
setTimeout(() => {
	entryInstance.SetStatus();
}, 20000);

process.on("uncaughtException", (err) => {
	entryInstance.InLog(err.message, err);
	entryInstance.devLog(err.message, err);
});

process.on("unhandledRejection", (err) => {
	entryInstance.InLog(err.message, err);
	entryInstance.devLog(err.message, err);
});

const PreviousLog = console.log;
entryInstance.prevlog = PreviousLog;

module.exports = { EntryPoint, entryInstance, disbut: entryInstance.disbut };
