import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { reverseDate } from './reverse-date';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material';

export interface IconAction {
	handler?: Function;
	onHover?: Function;
	icon: Function;
	title: Function;
}

@Component({
	selector: 'tr-fecha',
	templateUrl: './fecha.component.html',
	styleUrls: ['./fecha.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class FechaComponent implements OnInit {

	constructor(
	) { }

	modeloValue: any;
	@ViewChild('input') dateInput: ElementRef;
	@ViewChild(MatDatepicker) datepicker: MatDatepicker<dayjs.Dayjs>;

	/**
	 * Incluyo un input de un dayjs por si existe
	 * manipulación en el componente padre. Se actualizará
	 * añadiendo (cambiaFecha)="funcion($event)" que llevará
	 * el dayjs como argumento
	 */
	@Input() date = null;

	@Input() formato = 'DD/MM/YYYY';
	@Input() tab = -1;
	@Input() clase = 'fecha-width';
	@Input() required = false;
	@Input() placeholder = 'Fecha';
	@Input() disabled = false;
	@Input() nombre = 'fecha';
	@Input() min = null;
	@Input() max = null;

	@Input() form: FormGroup;

	@Input() prefixes: IconAction[] = [];
	@Input() suffixes: IconAction[] = [];

	@Input() openIcon = null;

	@Output() modeloChange = new EventEmitter();
	@Output() cambiaFecha = new EventEmitter();

	name: string;

	formDefault = new FormGroup({ });


	@Input()
	get modelo() {
		return this.modeloValue;
	}

	set modelo(val) {
		if (val && val.length === 0) {
			this.date = null;
		} else {
			if (val && dayjs(val).isValid()) {
				this.date = val;
			} else if (val && val.indexOf('/') !== -1 ) {
				this.date = dayjs(reverseDate(val));
			} else {
				this.date = dayjs(val);
			}
		}
		this.modeloValue = val;
		this.modeloChange.emit(this.modeloValue);
	}

	ngOnInit() {
		if (!this.form) {
			this.form = this.formDefault;
		}
		this.name = this.nombre;
		if (!this.name) {
			throw Error('No se definió name para autocomplete');
		}
	}

	get isReactive() {
		return this.form !== this.formDefault;
	}

	onCambiaFecha(event) {
		const inputValue: string = reverseDate(event.target._elementRef.nativeElement.value);
		if (!inputValue.includes('Invalid date')) {
			if (dayjs(inputValue).isValid()) {
				this.modelo = dayjs(inputValue).format(this.formato);
				this.cambiaFecha.emit(event.value); // Emito el dayjs
			} else {
				this.limpiar(event);
			}
		} else {
			this.limpiar(event);
		}
	}

	limpiar(event?: any) {
		if (event) {
			const value = event.target._elementRef.nativeElement.value;
			if (value === 'Invalid date') {
				event.target._elementRef.nativeElement.value = '';
				this.dateInput.nativeElement.focus();
			}
		}
		this.modelo = '';
		this.date = null;
		this.cambiaFecha.emit(null);
	}

	check() {
		if (!this.form && (!this.modelo || this.modelo.length === 0)) {
			this.dateInput.nativeElement.value = '';
		}
	}

	focus() {
		this.dateInput.nativeElement.focus();
	}

	onFocus(event) {
		if (event.target.select) {
			event.target.select();
		}
	}

	setHoy() {
		this.modelo = dayjs().format(this.formato);
		this.cambiaFecha.emit(dayjs()); // Emito el dayjs
	}

	getDayjs(): dayjs.Dayjs {
		return this.datepicker._selected;
	}

	setDayjs(date: dayjs.Dayjs) {
		if (dayjs(date).isValid()) {
			this.modelo = dayjs(date).format(this.formato);
			this.cambiaFecha.emit(date); // Emito el dayjs
		} else {
			this.limpiar();
		}
	}

}
