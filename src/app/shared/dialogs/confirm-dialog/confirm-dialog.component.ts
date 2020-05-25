import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

	constructor(
		@Inject(MAT_DIALOG_DATA) public data,
		public matDialogRef: MatDialogRef<ConfirmDialogComponent>
	) { }

	isHtml = false;

	ngOnInit() {
		// if (!this.data.titulo) {
		// 	this.data.titulo = '¿Desea confirmar la acción?';
		// }
		if (!this.data.confirmar) {
			this.data.confirmar = 'Confirmar';
		}
		if (!this.data.texto) {
			this.data.texto = `Presione "${this.data.confirmar}" para realizar la acción`;
		} else {
			this.isHtml = this.data.texto.includes('</');
		}
		// if (!this.data.cancelar) {
		// 	this.data.cancelar = 'Cancelar';
		// }
	}

	closeDialog() {
		this.matDialogRef.close(false);
	}

}
