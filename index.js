/**
 * Main entry point- Discord bot
 * Copyright Shwi 2021
 */

// Require vars
const Discord = require(`discord.js`);
const mongoose = require(`mongoose`);
const Main = require(`./utils/Main`);
const fs = require(`fs`);
const Err = require(`./utils/Err`);
const Cache = require(`./utils/Cache`);
const colors = require(`colors`);
const disbut = require("discord-buttons");
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
		this.client = new Discord.Client({partials: ["CHANNEL", "MESSAGE", "REACTION"]});
		this.connectedToButton = false;

    // Emojis
    this.e = {
      "x": "<:no:752721988388126730>",
      "r": "<:yes:752721984227508274>",
      "tic": "<:blurpleticket:872133307574386729>",
      "on": "<:online:752721988962746429>",
      "off": "<:offline:752721987842998342>",
      "idle": "<:idle:752721987855581246>",
      "dev": "<:dev:752721984621772890>",
      "dnd": "<:dnd:752721981245358091>",
      "bug1": "<:bughunter1:872841410561318952>",
      "bug2": "<:bughunter2:872841411119169576>",
      "hype": "<:hypesquad:872841411660247070>",
      "mod": "<:mod:752721983342379028>",
      "support": "<:blurplesupport:872133307742167080>",
      "line": "<:blurpleline:872133307733778462>",
      "cookie": "<:wumpuscookie:752721995954782319>",
      "partner": "<:partner:872841412838834256>",
      "cozy": "<:wumpuscozy:752721993857499276>",
      "i": "<:info:752721989046894693>",
      "luv": "<:pikaluv:872841567726108693>",
      "gift": "<:blurplegift:872133307737997372>",
      "new": ":dart:",
      "remove": "📄",
      "yarn": "🧶"
    }

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

	ConnectButton() {
		if (!this.connectedToButton) {
			disbut(this.client);
			this.connectedToButton = true;
			this.InLog("Connected to button!");
			this.disbut = disbut;
		}
	}

	SetStatus() {
		if (this.client?.user) {
			this.client.user.setActivity({ name: "You can do it!", type: "COMPETING" });
		}
	}

	Test() { }
}

const entryInstance = new EntryPoint();

entryInstance.StartBot();
entryInstance.ConnectMongoose();
entryInstance.ConnectButton();
setTimeout(() => {
	entryInstance.SetStatus();
}, 20000)

module.exports = { EntryPoint, entryInstance, disbut: entryInstance.disbut };
