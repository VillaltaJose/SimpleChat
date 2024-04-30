import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: 'rooms', loadChildren: () => import('./pages/room-picker/room-picker.module').then(m => m.RoomPickerModule) },
	{ path: 'chat/:roomId', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule) },
	{ path: '', redirectTo: 'rooms', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
