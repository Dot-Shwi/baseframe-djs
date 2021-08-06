// Event base
const Discord = require(`discord.js`);
const Index = require(`../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const { Cache, Err, Main } = require(`../utils/Utils`);
const Guilds = require(`../models/Guilds`);

const EventName = 'guildCreate';

class Event extends Index.EntryPoint {
    /**
     * Create event
     */
    constructor() {
        super(`event.${EventName}`);
        this.initiated = false;
    }

    /**
     * Initiate this event with client
     * @param {Discord.Client} client 
     */
    init(client) {
        if (this.initiated) return;
        this.client = client;
        this.initiated = true;
    }

    /**
     * Call the event 
     * @param {Discord.Guild} guild
     */
    async call(guild) {

        if (!this.initiated) return new Err(`Called ${EventName} event without initialisation!`);

        // Fetch guild if exist
        const existingGuild = await Guilds.findOne({ guildId: guild.id });

        if (!existingGuild) {
            // If guild doesn't exist in database, add it
            const guildDBEntry = await Guilds.create({
                guildId: guild.id,
                guildName: guild.name
            })
        }

    }
}

const Instance = new Event();

// Exports
module.exports = {
    name: EventName,
    call: (client, guild) => {

        // Call event
        if (!Instance.initiated) Instance.init(client);

        Instance.call(guild);

    },
    Event,
    Instance
}