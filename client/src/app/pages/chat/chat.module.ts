import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ChatComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: ChatComponent}]),
		FormsModule,
	],
})
export class ChatModule {}
