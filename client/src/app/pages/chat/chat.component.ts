import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TOPICS } from 'src/app/data/topics';
import { ChatService } from 'src/app/services/chat.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
	users: any = [];
	user: string;

	roomId: string;
	roomName: string;
	messages: any[] = [];

	message: string | null = null;

	constructor(
		private _activatedRoute: ActivatedRoute,
		private chatService: ChatService,
	) {
		this.roomId = this._activatedRoute.snapshot.paramMap.get('roomId') ?? '';
		this.user = localStorage.getItem('nombre') ?? '';

		this.roomName = TOPICS.find(t => t.id === this.roomId)?.name ?? '';
	}

	ngOnInit(): void {
		this.joinRoom();

		this.chatService.receivedMessage().subscribe((msg: any) => {
			this.messages.push(msg);
		});

		this.chatService.connectedUsers()
		.subscribe((users: any) => {
			this.users = users;
		}, (error) => {
			console.error(error);
		});
	}

	joinRoom() {
		try {
			this.chatService.connect();
			console.log('Connecting....')
			console.log(this.roomId, this.user)
			this.chatService.joinRoom(this.roomId, this.user);
		} catch (err) {
			console.error(err);
			setTimeout(() => this.joinRoom(), 1000)
		}
	}

	sendMessage() {
		if (!this.message) return;

		this.chatService.sendMessage(this.roomId, this.message, this.user);
      	this.message = '';
	}
}
