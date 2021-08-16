const { Message, MessageEmbed } = require("discord.js");
const Emoji = require("../utils/Emoji");

class Msg extends Message {
	static SendTemp = {
		content: "Content",
		embeds: [new MessageEmbed()],
		components: [],
	};

	/**
	 * Create content
	 * @param {String} toCreate
	 * @returns {Msg.SendTemp}
	 */
	static Content(toCreate) {
		return { content: toCreate };
	}

	/**
	 * Create embedded content
	 * @param  {...MessageEmbed} toCreate
	 * @returns {Msg.SendTemp}
	 */
	static Embed(...toCreate) {
		return { embeds: toCreate };
	}

	/**
	 * Create a new message, with more methods!
	 * @param {Message} message
	 */
	constructor(message) {
		super(
			message.client,
			{
				id: message.id,
				type: message.type,
				content: message.content,
				author: message.author,
				pinned: message.pinned,
				tts: message.tts,
				embeds: message.embeds,
				attachments: message.attachments,
				nonce: "123",
				guild: message.guild,
				member: message.member,
				cleanContent: message.cleanContent,
				activity: message.activity,
				application: message.application,
				components: message.components,
				createdAt: message.createdAt,
				createdTimestamp: message.createdTimestamp,
				deletable: message.deletable,
				deleted: message.deleted,
				editable: message.editable,
				editedAt: message.editedAt,
				editedTimestamp: message.editedTimestamp,
				flags: message.flags,
				partial: message.partial,
				pinnable: message.pinnable,
				reactions: message.reactions,
				reference: message.reference,
			},
			message.channel
		);
		this.raw = message;
	}

	/**
	 * Invalid
	 */
	inv(toSend = Msg.SendTemp, callback = (sentMessage = Message) => {}) {
		toSend.content = `${Emoji.x} ${toSend.content}`;
		this.rep(toSend, callback);
	}

	/**
	 * Send invalid
	 */
	invc(string) {
		this.inv(Msg.Content(string));
	}

	/**
	 * Done
	 */
	cor(toSend = Msg.SendTemp, callback = (sentMessage = Message) => {}) {
		toSend.content = `${Emoji.r} ${toSend.content}`;
		this.rep(toSend, callback);
	}

	/**
	 * Send correct
	 */
	corc(string) {
		this.cor(Msg.Content(string));
	}

	/**
	 * Reply without ping
	 */
	rep(toSend = Msg.SendTemp, callback = (sentMessage = Message) => {}) {
		this.raw.channel.send(toSend).then((sentMsg) => callback(sentMsg));
	}

	/**
	 * Send Reply without ping
	 */
	repc(string) {
		this.rep(Msg.Content(string));
	}

	/**
	 * An error occured
	 */
	err(toSend = Msg.SendTemp, callback = (sentMessage = Message) => {}) {
		toSend.content = `${Emoji.error} ${toSend.content}`;
		this.rep(toSend, callback);
	}

	/**
	 * Send err
	 */
	errc(string) {
		this.err(Msg.Content(string));
	}

	/**
	 * Unknown error occured
	 */
	unk(moreInfo = "") {
		this.err(Msg.Content(`An error occured! ${moreInfo}`));
	}

	/**
	 * Syntax error
	 */
	syn(toSend = Msg.SendTemp, callback = (sentMessage = Message) => {}) {
		toSend.content = `${Emoji.syntax} ${toSend.content}`;
		this.rep(toSend, callback);
	}

	/**
	 * Send syntax error
	 */
	sync(string) {
		this.syn(Msg.Content(string));
	}

	/**
	 * Reply with Content
	 * @param {...String} content
	 */
	crep(...content) {
		this.rep(Msg.Content(content.join("\n")));
	}

	/**
	 * Reply with embed
	 * @param {...MessageEmbed} embed
	 */
	erep(...embed) {
		this.rep(Msg.Embed(...embed));
	}

	/**
	 * All mentions
	 */
	get m() {
		return this.raw.mentions;
	}

	/**
	 * User ID
	 */
	get uid() {
		return this.author?.id;
	}

	/**
	 * User Avatar dynamic
	 */
	get ua() {
		return this.author?.avatarURL({ dynamic: true });
	}

	/**
	 * Guild ID
	 */
	get gid() {
		return this.guild?.id;
	}

	/**
	 * Guild Name
	 */
	get gn() {
		return this.guild?.name;
	}

	/**
	 * All User mentions
	 */
	get um() {
		return this.m?.users;
	}

	/**
	 * All channel mentions
	 */
	get cm() {
		return this.m?.channels;
	}

	/**
	 * All member mentions
	 */
	get mm() {
		return this.m?.members;
	}

	/**
	 * All role mentions
	 */
	get rm() {
		return this.m?.roles;
	}

	/**
	 * First user mention
	 */
	get fum() {
		return this.um?.first();
	}

	/**
	 * First member mention
	 */
	get fmm() {
		return this.mm?.first();
	}

	/**
	 * First channel mention
	 */
	get fcm() {
		return this.cm?.first();
	}

	/**
	 * First role mention
	 */
	get frm() {
		return this.rm?.first();
	}

	/**
	 * Get user mention at some argument
	 */
	mat(argumentIndex = 1) {
		const args = this.content.split(/\s/);
		const toCheck = args[argumentIndex];
		if (!toCheck) return;
		const userID = toCheck.includes("<@")
			? toCheck.trim().substr(2, 20)
			: toCheck;
		return userID;
	}

	/**
	 * Get channel mention at some argument
	 */
	cmat(argumentIndex = 1) {
		const args = this.content.split(/\s/);
		const toCheck = args[argumentIndex];
		if (!toCheck) return;
		const channelID = toCheck.includes("<#")
			? toCheck.trim().substr(2, 20)
			: toCheck;
		return channelID;
	}

	/**
	 * Does the channel mention everyone?
	 */
	get mevery() {
		return this.mentions?.everyone;
	}
}

module.exports = Msg;
