const express = require('express');
const router = express.Router();

router.get('/consul', (req, res) => {
	console.log('Consul');
	res.status(200).json({ success: true, message: 'Server is running' });
})

router.post('/sendMessage', (req, res) => {
	const { room, message } = req.body;

	req.app.messages.push({ room, message });

	req.app.io.to(room).emit('receivedMessage', { room, message });

	res.status(200).json({ success: true, message: 'Message sent successfully' });
});

module.exports = router;
