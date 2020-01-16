import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ComponentesService {

	constructor(
		private snackBar: MatSnackBar
	) { }

	notification(message) {
		this.snackBar.open(message, 'Cerrar', {
			duration: 5 * 1000,
			panelClass: 'snack',
			verticalPosition: 'bottom',
			horizontalPosition: 'start'
		});
	}
}
