const Main = require(`./Main`);

class Cache extends Main {
	static DefaultLog = false;
	static All = [];

	/**
	 * Create a cache that stores, well, cache.
	 * By default, it logs. Use Cache.DefaultLog = false to turn off default logging.
	 * To log manually, use Cache#Log which logs the message of cache
	 * @param {String} message The message to cache
	 * @param {Object} object Object (if any) details
	 */
	constructor(message, object) {
		super(`Cache`);
		object = object || {};
		this.message = message;
		object.at = new Date();
		this.object = object;
		this.id = Cache.All.length + 1;

		// Log
		if (Cache.DefaultLog) this.Log();
	}

	/**
	 * Log this cache
	 */
	Log(extra = "") {
		this.InLog(this.message + "\n" + extra);
		return this;
	}

	/**
	 * Get cache info
	 */
	get info() {
		return {
			id: this.id,
			message: this.message,
			at: this.object.at,
			object: this.object,
		};
	}
}

module.exports = Cache;
