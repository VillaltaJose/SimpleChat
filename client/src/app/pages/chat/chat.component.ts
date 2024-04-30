import { Component } from '@angular/core';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
	users = [1, 2, 3, 4, 5];
}
