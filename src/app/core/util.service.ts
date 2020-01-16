import { Injectable, EventEmitter, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '@env';
import { AppComponent } from '@app/app.component';
import * as dayjs from 'dayjs';
import { ConfirmDialogComponent } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessComponent } from '@app/shared/snackbar/success/success.component';
import { InformationComponent } from '@app/shared/snackbar/information/information.component';
import { ErrorComponent } from '@app/shared/snackbar/error/error.component';
import { LoadingDirective } from '@app/shared/loading.directive';
import { RetryingComponent } from '@app/shared/snackbar/retrying/retrying.component';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable()
export class UtilService {

	constructor(
		private router: Router,
		private snackBar: MatSnackBar,
		private matDialog: MatDialog
	) { }

	appComponent: AppComponent;

	reload(prevUrl?) {
		this.appComponent.ngOnInit();
		const router = this.router;
		if (!prevUrl) {
			prevUrl = this.router.url;
		}
		this.router.navigateByUrl('/').then(function() {
			router.navigateByUrl(prevUrl);
		});
	}

	removeInvalidClasses() {
		setTimeout(() => {
			Array.from(document.querySelectorAll('mat-form-field')).forEach((formField) => {
				if (formField.className.includes('mat-form-field-invalid')) {
					formField.className = formField.className.replace('mat-form-field-invalid', '');
				}
			});
		}, 300);
	}

	/**
	 * Función que devuelve el padre más cercano filtrando por selector
	 * @param element Selector base
	 * @param parent Selector padre al que sea desea llegar
	 */
	parents(element: string | any, parent: string) {
		let el: any = typeof element === 'string' ? document.querySelector(element) : element;
		const parents = Array.from(document.querySelectorAll(parent));
		while (el.tagName !== 'HTML') {
			el = el.parentNode;
			if (parents.indexOf(el) !== -1) {
				return el;
			}
		}
		return null;
	}

	enableDisableControl(group: FormGroup | FormArray, enable: boolean = true): void {
		Object.keys(group.controls).forEach((key: string) => {
			const abstractControl = group.controls[key];
	
			if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
				this.enableDisableControl(abstractControl);
			} else {
			  if (enable) {
				abstractControl.enable();
			  } else {
				abstractControl.disable();
			  }
			}
		});
	}
	
	bloquearScroll(opened: boolean) {
		document.querySelector('html').setAttribute('style', opened ? 'hidden' : 'auto');
		if (opened) {
			this.smoothScroll();
		}
	}

	smoothScroll() {
		const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
		if (currentScroll > 0) {
			window.requestAnimationFrame(this.smoothScroll);
			window.scrollTo(0, currentScroll - (currentScroll / 5));
		}
	}

	notification(statusMessage: string, tipo?: string, duration?: number) {
		if (tipo) {
			let snackBar;
			if (tipo === 'success') {
				snackBar = SuccessComponent;
			} else if (tipo === 'warning') {
				snackBar = InformationComponent;
			} else if (tipo === 'error') {
				snackBar = ErrorComponent;
			} else if (tipo === 'retrying') {
				snackBar = RetryingComponent;
			}
			return this.snackBar.openFromComponent(snackBar, {
				duration: duration || 5000,
				data: statusMessage,
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
		} else {
			return this.snackBar.open(statusMessage, 'Cerrar', {
				duration: duration || 5000,
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
		}
	}

	setControlsLoadingState(description: string, state: boolean, directive: QueryList<LoadingDirective>) {
		const element = directive.find(item => item.newElementData.descripcion === description);
		element.render(state);
	}

	monthName(month, format?: string) {
		const fecha = dayjs().set('month', month);
		let mes: string;
		if (format) {
			mes = fecha.format(format);
		} else {
			mes = fecha.format('MMMM');
		}
		return mes.substring(0, 1).toUpperCase() + mes.substr(1);
	}

	/**
	 *  Getter de localStorage
	 *  @param nombreVariable - Nombre de la variable
	 *  @param decodificar - true : json, false: string
	**/
	getLS(nombreVariable: string, decodificar?: boolean): any {
		let resultado = localStorage.getItem(nombreVariable);
		if (decodificar) {
			try {
				resultado = JSON.parse(resultado);
			} catch (e) {
				resultado = null;
			}
		}
		if (!resultado) {
			resultado = '';
		}
		return resultado;
	}

	/**
	 *  Setter de localStorage
	 *  @param nombreVariable - Nombre de la variable
	 *  @param enJson - true : json, false: string
	 *  @param valor - Valor a guardar
	**/
	setLS(nombreVariable: string, valor: any, enJson?: boolean) {
		if (enJson) {
			valor = JSON.stringify(valor);
		}
		localStorage.setItem(nombreVariable, valor);
		return valor;
	}

	loseFocus() {
		setTimeout(() => {
			const el: any = document.querySelector(':focus');
			el.blur();
		}, 0);
	}

	haySubtablas() {
		return (document.querySelectorAll('.subtabla').length > 0) && !(Array.from(document.querySelectorAll('.subtabla')).filter(function () { return getComputedStyle(this.parentNode).display === 'flex'; }).length === 0);
	}

	abrirUrl(url) {
		window.open(environment.baseUrl + url, '_blank');
	}

	tieneClase(elem, clase) {
		return document.querySelector(elem).className.includes(clase);
	}

	leeArchivo(input, readAs, onerror: Function) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = () => {
				onerror();
				reject();
			};
			switch (readAs) {
				case 'text':
					reader.readAsText(input.files[0]);
					break;
				case 'dataurl':
					reader.readAsDataURL(input.files[0]);
					break;
			}
		});
	}

	openConfirmDialog(datos: {titulo?: string, texto?: string, confirmar?: string, cancelar?: string}) {
		return this.matDialog.open(ConfirmDialogComponent, {
			width: '500',
			maxWidth: '50vw',
			minWidth: '40vw',
			disableClose: true,
			data: datos,
			autoFocus: false,
			panelClass: 'confirm-dialog'
		});
	}

}
