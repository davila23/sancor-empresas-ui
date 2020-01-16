import { Injectable } from '@angular/core';
import { User } from '@app/models/user.model';
import { UtilService } from './util.service';

@Injectable()
export class AuthService {

	constructor(
		private utilService: UtilService
	) {
		this.user = this.utilService.getLS('user', true);
	}

	user;

	login() {
		// backend
		this.user = {
			name: 'John Doe',
			role: 'Administrador'
		};
		this.utilService.setLS('user', this.user, true);
	}
}
