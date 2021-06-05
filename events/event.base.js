// Event base
const Discord = require(`discord.js`);
const Index = require(`../index`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);
const { Cache, Err, Main } = require(`../utils/Utils`);

const EventName = 'event';

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
        if(this.initiated) return;
        this.client = client;
        this.initiated = true;
    }

    /**
     * Call the event 
     */
    call() {

        if(!this.initiated) return new Err(`Called ${EventName} event without initialisation!`);


    }
}

const Instance = new Event();

// Exports
module.exports = {
    name: EventName,
    call: (client) => {

        // Call event
        if(!Instance.initiated) Instance.init(client);

        Instance.call();

    },
    Event,
    Instance
}