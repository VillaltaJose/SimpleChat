import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOPICS } from 'src/app/data/topics';
import { ChatService } from 'src/app/services/chat.service';

@Component({
	selector: 'app-room-picker',
	templateUrl: './room-picker.component.html',
	styleUrls: ['./room-picker.component.scss'],
})
export class RoomPickerComponent implements OnInit {
	salas: any[] = TOPICS;

	selectedRoom: string | null = null;
	nombre: string | null = localStorage.getItem('nombre') ?? null;

	constructor(
		private router: Router,
		private chatService: ChatService,
	) {}

	ngOnInit(): void {
		try {
			this.chatService.leaveRoom();
		} catch {}
	}

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
		this.router.navigate(['/chat', this.selectedRoom]);
	}
}
