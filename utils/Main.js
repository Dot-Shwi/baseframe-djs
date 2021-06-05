const colors = require(`colors`);
class Main {
    constructor(name) {
        name = name || "Bot";
        name = `Bot.` + name;
        this.name = name;
        this.cache = [];
    }

    InLog(...message) {
        console.log(`[${this.name}]:`.yellow +` ${message}`)
    }
}

module.exports = Main;