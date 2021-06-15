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
		this.client = new Discord.Client();
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

	Test() {}
}

const entryInstance = new EntryPoint();

entryInstance.StartBot();
entryInstance.ConnectMongoose();

module.exports = { EntryPoint, entryInstance };
