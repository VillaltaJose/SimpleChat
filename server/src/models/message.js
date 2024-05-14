class Message {
	constructor(id, sender, content, timestamp) {
		this.id = id;
		this.sender = sender;
		this.content = content;
		this.timestamp = timestamp;
	}
}

module.exports = Message;
