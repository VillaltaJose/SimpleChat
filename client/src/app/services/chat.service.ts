import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	connection: any = new signalR.HubConnectionBuilder()
		.withUrl('http://localhost:5264/chat')
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

	async start() {
		try {
			await this.connection.start();
		} catch (err) {
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
