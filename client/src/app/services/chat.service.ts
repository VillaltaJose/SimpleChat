import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	connection: any = new signalR.HubConnectionBuilder()
		.withUrl('http://localhost:5264/chat')
		// .withUrl('http://192.168.180.9:5264/chat')
		.configureLogging(signalR.LogLevel.Information)
		.build();

	messages$ = new BehaviorSubject<any>([]);
	connectedUsers$ = new BehaviorSubject<string[]>([]);
	messages: any[] = [];
	users: string[] = [];

	constructor() {
		this.start();
		this.connection.on("ReceiveMessage", (data: any) => {
			console.log(data)
			this.messages = [...this.messages, data];
			this.messages$.next(this.messages);
		});

		this.connection.on("ConnectedUser", (users: any)=>{
			this.connectedUsers$.next(users);
			this.users = users;
		});
	}

	clearMessages() {
		this.messages = [];
		this.users = [];

		this.messages$.next(this.messages);
		this.connectedUsers$.next(this.messages);
	}

	async start() {
		console.log('Init conn')

		try {
			await this.connection.start();
		} catch (err) {
			console.log('Conexión: ')
			console.error(err);
			setTimeout(() => this.start(), 3000);
		}
	}

	async joinRoom(user: string, room: string) {
		return this.connection.invoke('JoinRoom', {user, room});
	}

	async sendMessage(message: string) {
		return this.connection.invoke('SendMessage', message);
	}

	async leaveChat() {
		return this.connection.stop();
	}
}
