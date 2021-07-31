const { entryInstance } = require(`../index`);
const config = require(`../store/config.json`);
const reqString = { type: String, required: true };
const unreqString = { type: String, required: false }
const GuildsSchema = new entryInstance.mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    prefix: { type: String, required: true, default: config.Bot.prefix }
})
module.exports = entryInstance.mongo.model('Guilds', GuildsSchema);