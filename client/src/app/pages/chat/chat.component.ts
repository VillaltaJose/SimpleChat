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
		this.chatService.messages$.subscribe((res) => {
			this.messages = res;
			console.log(this.messages);
		});

		this.chatService.connectedUsers$.subscribe((res) => {
			console.log(res);
			this.users = res;
		});
	}

	sendMessage() {
		if (!this.message) return;

		this.chatService.sendMessage(this.message)
		.then(() => {
			this.message = null;
		});
	}
}
