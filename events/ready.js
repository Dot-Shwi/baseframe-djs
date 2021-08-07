const Index = require(`../index`);
const Cache = require(`../utils/Cache`);
const Err = require(`../utils/Err`);
const Guilds = require(`../models/Guilds`);
const Users = require(`../models/Users`);

class Ready extends Index.EntryPoint {
  constructor() {
    super(`event.ready`);
    this.initiated = false;
  }
  init(client) {
    if (this.initiated) return;
    this.client = client;
    this.initiated = true;
    this.cache.push(new Cache(`Initiated ready event!`));
  }
  call() {
    if (!this.initiated)
      return new Err(
        `Called ready event without initialisation!`,
        `EVTRDYNOINIT`,
        { instance: this, class: Ready }
      );
    // Call ready event
    this.InLog(`Client online as ${this.client.user.tag}!`);
    this.cache.push(
      new Cache(`Client logged in and online!`, { client: this.client })
    );
    this.dev_logs = this.client.channels.cache.get(this.config.Dev.dev_logs);

    this.devLog(
      `${
        this.e.cookie
      } **Online!** At: ${new Date().toLocaleString()} | Platform: ${
        process.platform
      } | P-V: ${process.version} | Path: ${process.execPath}`
    );
  }
}

const readyEventInstance = new Ready();

module.exports = {
  name: "ready",
  call: (client) => {
    if (!readyEventInstance.initiated) readyEventInstance.init(client);
    readyEventInstance.call();
  },
  Ready,
  readyEventInstance,
};
