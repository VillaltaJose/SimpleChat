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

	selectedRoom: any = null;

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

		this.connection.onclose(async () => {
            console.log('Reintentando conexion');
            await this.start();

			if (this.selectedRoom) {
				this.joinRoom(this.selectedRoom.user, this.selectedRoom.room)
			}
        });
	}

	clearMessages() {
		this.messages = [];
		this.users = [];

		this.messages$.next(this.messages);
		this.connectedUsers$.next(this.messages);
	}

	async start() {
		try {
			await this.connection.start();
		} catch (err) {
			setTimeout(() => this.start(), 3000);
		}
	}

	async joinRoom(user: string, room: string) {
		this.selectedRoom = {
			user,
			room
		}
		return this.connection.invoke('JoinRoom', {user, room});
	}

	async sendMessage(message: string) {
		return this.connection.invoke('SendMessage', message);
	}

	async leaveChat() {
		return this.connection.stop();
	}
}
