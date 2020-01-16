import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import * as dayjs from 'dayjs';
import { reverseDate } from './reverse-date';
import { MatDatepicker } from '@angular/material';

const INVALID_DATE_TEXT = 'Fecha inválida';

@Directive({
	selector: '[trFecha]'
})
export class FechaDirective {

	constructor(
		private el: ElementRef,
	) { }

	@Input('matDatepicker') datepicker: MatDatepicker<any>;

	// Allow decimal numbers and negative values
	private regex: RegExp = new RegExp(/^[0-9]+$/g);

	// Allow key codes for special events. Reflect :
	// Backspace, tab, end, home
	private specialKeys: Array<string> = ['*', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', '/'];

	@HostListener('keydown', ['$event'])
	onKeyDown(event: any) {

		if (event.target.value === INVALID_DATE_TEXT) {
			event.target.value = '';
			return;
		}

		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}

		/** Si no es tecla especial o número */
		if (!String(event.key).match(this.regex) && event.key !== 'Enter' && event.key !== '/') {
			event.preventDefault();
			return;
		}

		let current = this.el.nativeElement.value;
		const next: string = this.el.nativeElement.value.concat(event.key);

		/** Si está seleccionado, reemplazo */
		const seleccionado = this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd === current.length;
		if (seleccionado && current.length > 0 && event.key !== 'Enter') {
			event.target.value = event.key;
			event.preventDefault();
			return;
		}

		if (next.length > 10 && event.key !== 'Enter') {
			event.preventDefault();
			return;
		}


		if (event.key === '/') {
			if (current.length !== 2 && current.length !== 5 && current.length !== 4) {
				event.preventDefault();
			}
		}
		if (next.length === 10) {
			const f = dayjs(reverseDate(next));
			if (f.isValid()) {
				event.target.value = f.format('DD/MM/YYYY');
				this.datepicker.select(f);
			}
		}
		if (event.key === 'Enter') {
			const ahora = dayjs();
			switch (current.length) {
				case 0:
					current = null;
					break;
				case 1:
					if (current === '*') {
						current = ahora.format('DD/MM/YYYY');
					}
					break;
				case 2:
					current = current + ahora.format('/MM/YYYY');
					break;
				case 3:
					current = current + ahora.format('M/YYYY');
					break;
				case 4:
					current = current + ahora.format('/YYYY');
					break;
				case 5:
					if ((current.split('/').length - 1) === 2) {
						current = current + ahora.format('YYYY');
					} else {
						current = current + ahora.format('/YYYY');
					}
					break;
				case 6:
					current = current + ahora.format('YYYY');
					break;
				default:
					break;
			}
			if (current) {
				const f = dayjs(reverseDate(current));
				if (f.isValid()) {
					event.target.value = f.format('DD/MM/YYYY');
					this.datepicker.select(f);
				} else {
					event.target.value = INVALID_DATE_TEXT;
					// this.fecha.select(null);
				}
				return;
			}
		} else if (event.key !== 'Backspace' && event.key !== 'Delete') {
			if (current.length === 2 || current.length === 5) {
				event.target.value = current + '/' + event.key;
			} else {
				event.target.value = next;
			}
		}
		event.preventDefault();
	}

}
