const express = require('express');
const http = require('http');
const cors = require('cors');
const configureSocket = require('./utils/socketManager');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

configureSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
