const { entryInstance } = require(`../index`);
const reqString = { type: String, required: true };
const unreqString = { type: String, required: false }
const UsersSchema = new entryInstance.mongoose.Schema({
    userTag: reqString,
    userId: reqString
})
module.exports = entryInstance.mongo.model('BotUsers', UsersSchema);