import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatInput } from '@angular/material';
import { AutocompleteComponent } from '../autocomplete';
import { FechaComponent } from '../fecha';

@Component({
	selector: 'tr-inputbs',
	templateUrl: 'inputbs.component.html',
	styleUrls: ['inputbs.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class InputBSComponent implements OnInit, AfterViewInit {
	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private elementRef: MatBottomSheetRef<InputBSComponent>
	) {
		if (!data.tipo) {
			data.tipo = 'input';
		}
		if (!data.placeholder) {
			data.placeholder = 'Ingrese un valor';
		}

	}

	modelo = { value : ''};
	inicializado = false;

	@ViewChild('input') inputElement: ElementRef;
	@ViewChild(AutocompleteComponent) autocompleteComponent: AutocompleteComponent;
	@ViewChild(FechaComponent) fechaComponent: FechaComponent;
	@ViewChild(MatInput) inputComponent: MatInput;

	ngOnInit() {
		this.inicializado = true;
	}

	ngAfterViewInit() {
		this.modelo.value = this.data.value;

		switch (this.data.tipo) {
			case 'fecha':
				// para establecer la fecha con un dayjs, enviar "date" en "data"
				for (const key in this.fechaComponent) {
					if (this.fechaComponent.hasOwnProperty(key) && this.data.hasOwnProperty(key)) {
						this.fechaComponent[key] = this.data[key];
					}
				}
				break;
			case 'autocomplete':
				if ((!this.data.resultados || this.data.resultados.length === 0) && !this.data.busca) {
					throw new Error('No especificó resultados ni búsqueda para autocomplete');
				}
				for (const key in this.autocompleteComponent) {
					if (this.autocompleteComponent.hasOwnProperty(key) && this.data.hasOwnProperty(key)) {
						this.autocompleteComponent[key] = this.data[key];
					}
				}
				break;
			default:
				for (const key in this.inputComponent) {
					if (this.inputComponent.hasOwnProperty(key) && this.data.hasOwnProperty(key)) {
						this.inputComponent[key] = this.data[key];
					}
				}
				break;
		}
		if (this.data.tipo === 'input' || this.data.tipo === 'textarea') {
			this.elementRef.afterOpened().toPromise().then(() => {
				this.inputElement.nativeElement.focus();
			});
		} else if (this.data.tipo === 'autocomplete') {
			this.elementRef.afterOpened().toPromise().then(() => {
				this.autocompleteComponent.focus();
			});
		}
	}

	/**
	 * Fecha devolverá value y formattedValue
	 * Autocomplete devolverá en value el objeto seleccionado
	 * Input devolverá en value el valor del input
	 */
	cerrar(value?: any): void {
		switch (this.data.tipo) {
			case 'fecha':
				this.data['value'] = this.fechaComponent.getDayjs();
				break;
			case 'autocomplete':
				/** TODO: if autocomplete.chips */
				this.data['value'] = value;
				break;
			default:
				this.data['value'] = this.modelo.value;
			break;
		}
		if (!this.data['value']) {
			this.data['value'] = null;
		}
		this.elementRef.dismiss(this.data);
	}

	onFocus(event) {
		if (event.target.select) {
			event.target.select();
		}
	}
}
