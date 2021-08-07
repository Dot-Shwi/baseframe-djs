const colors = require(`colors`);
class Main {
  constructor(name) {
    name = name || "Bot";
    name = `Bot.` + name;
    this.name = name;
    this.cache = [];

    this.config = require(`../store/config.json`);
  }

  InLog(...message) {
    console.log(`[${this.name}]:`.yellow, ...message);
  }
}

module.exports = Main;
