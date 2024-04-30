import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPickerComponent } from './room-picker.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [RoomPickerComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: RoomPickerComponent }]),
		FormsModule,
	],
})
export class RoomPickerModule {}
