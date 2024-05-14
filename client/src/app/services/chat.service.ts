import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	constructor(private socket: Socket) {}

	sendMessage(room: string, message: string, user: string) {
		this.socket.emit('sendMessage', { room, message, user });
	}

	joinRoom(room: string, user: string) {
		this.socket.emit('joinRoom', { room, user });
	}

	receivedMessage() {
		return this.socket.fromEvent('receivedMessage');
	}

	connectedUsers() {
		return this.socket.fromEvent('connectedUsers');
	}

	leaveRoom() {
		this.socket.disconnect();
	}

	connect() {
		this.socket.connect();
	}
}
