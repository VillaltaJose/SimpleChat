import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
	selector: 'app-room-picker',
	templateUrl: './room-picker.component.html',
	styleUrls: ['./room-picker.component.scss'],
})
export class RoomPickerComponent {
	salas: any[] = [
		{
			name: 'Javascript',
			id: 'f540af8f-bc54-4f03-b784-0bd94f377077',
		},
		{
			name: 'C# NET Core',
			id: 'b38acfba-cb47-46b0-acd4-78676550d84c',
		},
		{
			name: 'Java Spring Boot',
			id: 'bfc175a7-a374-4f0b-8055-07d806d839d0',
		},
		{
			name: 'Python',
			id: '2350ddba-db30-41f2-b874-9600fd32b2a8',
		},
		{
			name: 'PHP',
			id: '205ec040-b3ad-4800-a934-a50c97cca531',
		},
	];

	selectedRoom: string | null = null;
	nombre: string | null = localStorage.getItem('nombre') ?? null;

	constructor(
		private router: Router,
		private chatService: ChatService,
	) {}

	ingresarSala() {
		if (!this.selectedRoom) {
			alert('Seleccione una sala');
			return;
		}

		if (!this.nombre) {
			alert('Ingrese un nombre');
			return;
		}

		localStorage.setItem('nombre', this.nombre);

		this.chatService.joinRoom(this.nombre, this.selectedRoom)
			.then(() => {
				this.router.navigate(['/chat', this.selectedRoom]);
			})
	}
}
