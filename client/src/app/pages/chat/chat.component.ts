import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
	users = [1, 2, 3, 4, 5];

	roomId: string;

	constructor(
		private _activatedRoute: ActivatedRoute,
	) {
		this.roomId = this._activatedRoute.snapshot.paramMap.get('roomId') ?? '';
	}
}
