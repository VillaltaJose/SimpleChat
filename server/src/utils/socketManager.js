const socketIo = require('socket.io');

const messages = [];
const users = {};

function configureSocket(server) {
	const io = socketIo(server, {
		cors: {
			origin: '*',
		}
	});

	io.on('connection', (socket) => {
		console.log('Nueva conexión establecida');

		socket.on('joinRoom', (data) => {
			const { room, user } = data;
			socket.join(room);
			console.log(`${user} se ha unido a la sala ${room}`);

			io.to(room).emit('receivedMessage', { room, message: `${user} se ha unido a la sala` });

			const pendingMessages = messages.filter((msg) => msg.room === room);
			pendingMessages.forEach((msg) => {
				socket.emit('receivedMessage', msg);
			});

			users[socket.id] = { room, user };

			const connectedUsers = Object.values(users).filter((user) => user.room === room).map(u => u.user);
			io.to(room).emit('connectedUsers', connectedUsers);
		});

		socket.on('sendMessage', (data) => {
			console.log('Message received:', data);
			const { room, message, user } = data;

			messages.push({ room, message, user });

			io.to(room).emit('receivedMessage', { room, message, user });
		});

		socket.on('disconnect', () => {
			const connection = users[socket.id];
			delete users[socket.id];

			if (!connection || !connection.user) {
				return;
			}

			console.log(`${connection.user} disconnected ${connection.room}`);
			io.to(room).emit('receivedMessage', { room, message: `${connection.user} se ha desconectado de la sala` });

			const connectedUsers = Object.values(users).filter((user) => user.room === connection.room)
				.map(u => u.user);
			
			io.to(connection.room).emit('connectedUsers', connectedUsers);
		});
	});
}

module.exports = configureSocket;
