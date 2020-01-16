import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, DoCheck, HostListener } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ComponentesService } from '../componentes.service';
import { HttpService } from '@app/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent, MatAutocomplete, MatButton } from '@angular/material';

export interface CadaChip {
	name: string;
	_deAuto: boolean;
	autoValue: string;
	autoLabel: string;
	label: string;
}

export interface Destacado {
	atributo: string;
	clase: string;
}

export type IDestacado = Destacado | string;

@Component({
	selector: 'tr-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, DoCheck {

	constructor(
		private httpService: HttpService,
		private componentesService: ComponentesService
	) {	}

	modelValue: any;
	resultadosFiltrados = [];
	listaChips: CadaChip[] = [];
	request = null;
	name: string;
	readonly = false;

	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER];

	/** Form genérico para detectar si se transmitió FormGroup */
	formDefault = new FormGroup({});

	/** Simplifica validaciones */
	isReactive = false;

	modeloDefault = {
		valor : ''
	};

	/** Si utiliza atributo autofocus */
	@Input() autoFocus = false;

	/** tabindex, no utiliza directiva FocusNext */
	@Input() tab = -1;

	/** Clase que aplica al mat-form-field */
	@Input() clase = '';

	/** Classlist que se aplican al overlay container del mat-autocomplete */
	@Input() classList = '';

	/** Nombre de variable a asignar en objeto "modelo", donde va el texto del autocomplete */
	@Input() nombre: string = null;

	/** Nombre de variable a asignar en objeto "modelo", donde va el id del resultado del autocomplete */
	@Input() idNombre: string = null;

	/** Nombre que se muestra en opciones y que se asigna a "nombre" */
	@Input() nombreResultado = 'label';

	/** Nombre de variable a buscar id en resultado que se asigna a "idNombre" */
	@Input() idNombreResultado = 'value';

	/**
	 *	Primer argumento "que" de método autocomplete en HttpService
	 *	Por ej: 'cuentascorrientes'
	 */
	@Input() busca: string;

	/** Array de resultados, no se realizarán llamadas al backend */
	@Input() resultados: { label: string, value: string | number }[] = [];

	/** Parámetros extra al realizar la petición */
	@Input() buscaExtra = {};

	/** Si es campo required */
	@Input() required = false;

	/** Texto placeholder del input */
	@Input() placeholder = '';

	/** Atributo disabled del input */
	@Input() disabled = false;

	/** Botón extra que se pone como sufijo en input */
	@Input() boton = '';

	/** Consejo que va debajo del input en texto pequeño */
	@Input() hint = '';

	/** Mínimo de caracteres necesarios para realizar la búsqueda en backend */
	@Input() min = 2;

	@Input() form: FormGroup;

	/** Convertir el autocomplete en chips */
	@Input() chips = false;

	/** Convertir las Options en html (innerHTML) */
	@Input() optHtml = false;

	/**
	 *	Función personalizada que devuelve los datos al autocomplete
	 *
	 *	* IMPORTANTE: Debe devolver objetos que al menos tengan atributo 'label' y 'value'
	 *	o los que se hayan especificado mediante 'nombreResultado' y 'idNombreResultado'
	 */
	@Input() customSearch: Function;

	@Input() destacar: IDestacado[] = [];

	/** Emite evento con el objeto traido del backend al seleccionar una opción */
	@Output() establecido = new EventEmitter();

	/** Emite evento al realizar click en boton de sufijo */
	@Output() clickBoton = new EventEmitter();

	@Output() modeloChange = new EventEmitter();

	/** Emite evento al cambiar los chips */
	@Output() chipChanges = new EventEmitter();

	@ViewChild('input') inputElement: ElementRef;

	@ViewChild('limpiarBtn') limpiarBtn: MatButton;

	@ViewChild('autocomplete') matAutocomplete: MatAutocomplete;


	@Input()
	get modelo() {
		return this.modelValue;
	}

	set modelo(val) {
		this.modelValue = val;
		this.modeloChange.emit(this.modelValue);
	}

	ngOnInit() {
		if (!this.form) {
			this.form = this.formDefault;
		} else {
			this.isReactive = true;
		}
		if (!this.nombre) {
			// throw Error('No se definió name para autocomplete');
			this.modelo = this.modeloDefault;
			this.name = 'valor';
		} else {
			this.name = this.nombre;
		}
		if (this.resultados && this.resultados.length > 0 && this.resultados.length < 10 && this.min === 2) {
			this.min = 0;
			this.resultadosFiltrados = this.resultados;
		}
		if (this.isReactive) {
			this.form.get(this.name).valueChanges.subscribe((val) => {
				if (!val || val.length === 0 ) {
					this.readonly = false;
					if (this.min === 0 && this.resultadosFiltrados.length === 0) {
						if (this.isReactive && this.form.get(this.name).value !== null) {
							this.buscar('');
						}
					}
					if (this.idNombre !== null && this.form.get(this.idNombre).value) {
						this.limpiar(true);
					}
					this.resultadosFiltrados = [];
				}
				if (this.idNombre !== null && val && this.form.get(this.idNombre).value) {
					this.readonly = true;
					clearTimeout(this.request);
					this.request = null;
				} else if (val) {
					// Probar bien este pristine (para que no busque cuando se setea programáticamente)
					if (!this.form.get(this.name).pristine) {
						this.buscar(val);
					}
				}
			});
		}
	}

	ngDoCheck() {
		if (this.readonly) {
			if (!this.isReactive) {
				if (this.modelo && this.nombre && typeof this.modelo[this.nombre] === 'string' && this.modelo[this.nombre].length === 0) {
					this.readonly = false;
				}
			} else {
				if (this.form.get(this.name).value === null) {
					this.readonly = false;
				}
			}
		}
	}

	/** Realiza la búsqueda en el backend si es remota o en array resultados */
	buscar(busqueda) {
		if ((!busqueda || busqueda.length === 0) && this.min > 0) {
			if (!this.isReactive) {
				this.limpiar();
			}
		} else if (!this.readonly) {
			if (!this.resultados || this.resultados.length === 0) {
				if (typeof busqueda === 'string' && busqueda.length >= this.min) {
					clearTimeout(this.request);
					this.request = setTimeout(() => {
						if (this.customSearch) {
							this.customSearch(busqueda).then(data => {
								this.resultadosFiltrados = data;
								this.request = null;
							});
						} else {
							this.httpService.autocomplete(this.busca, busqueda, this.buscaExtra).then(data => {
								this.resultadosFiltrados = data;
								this.request = null;
							});
						}
					}, 400);
				} else {
					this.resultadosFiltrados = [];
				}
			} else {
				if (typeof busqueda === 'string' && busqueda.length >= this.min) {
					let texto = busqueda.toLowerCase();
					if (this.chips) {
						texto = '^' + texto;
					}
					const re = new RegExp(texto);
					this.resultadosFiltrados = this.resultados.filter((val) => {
						const label = val[this.nombreResultado].toLowerCase();
						return re.test(label);
					});
				} else {
					this.resultadosFiltrados = [];
				}
			}
		}
	}

	establecer(ev) {
		if (!this.isReactive) {
			// const resultado: any = Object.assign({}, this.modelo[this.nombre]);
			const resultado: any = ev.option.value;
			if (this.isValid() || (typeof resultado === 'object') && resultado !== undefined) {
				this.modelo[this.nombre] = resultado[this.nombreResultado];
				if (this.idNombre !== null) {
					this.modelo[this.idNombre] = resultado[this.idNombreResultado];
				}
				if (this.chips) {
					if (resultado && resultado[this.nombreResultado]) {
						this.listaChips.push({
							name: resultado[this.nombreResultado].trim(),
							_deAuto: true,
							autoValue: resultado['value'],
							autoLabel: resultado[this.nombreResultado].trim(),
							label: resultado[this.nombreResultado].trim()
						});
						this.inputElement.nativeElement.value = '';
					}
				} else if (resultado) {
					if (resultado && !this.readonly) {
						this.establecido.emit(resultado);
					}
					this.readonly = true;
				}
			}
		} else {
			const resultado: any = ev.option.value;
			if ((this.isValid() || this.form.get(this.name).value === resultado) && resultado !== undefined) {
				this.form.get(this.name).patchValue(resultado[this.nombreResultado]);
				if (this.idNombre !== null) {
					this.form.get(this.idNombre).patchValue(resultado[this.idNombreResultado]);
				}
				if (this.chips) {
					if (resultado && resultado[this.nombreResultado]) {
						this.listaChips.push({
							name: resultado[this.nombreResultado].trim(),
							_deAuto: true,
							autoValue: resultado['value'],
							autoLabel: resultado[this.nombreResultado].trim(),
							label: resultado[this.nombreResultado].trim()
						});
						this.inputElement.nativeElement.value = '';
					}
					// this.chipChanges.emit(this.listaChips);
				} else {
					if (resultado && !this.readonly) {
						this.establecido.emit(resultado);
					} else if (resultado) {
						console.log('no emito por tarde',resultado);
					}
					this.readonly = true;
				}
			}
		}
	}

	onClickBoton(event) {
		event.preventDefault();
		event.stopPropagation();
		this.clickBoton.emit(event);
		return false;
	}

	limpiar(noEmitir?: boolean) {
		this.readonly = false;
		if (this.form === this.formDefault) {
			this.modelo[this.nombre] = '';
			if (this.idNombre !== null) {
				this.modelo[this.idNombre] = '';
			}
			this.establecido.emit(this.modelo[this.nombre]);
		} else {
			this.form.get(this.name).reset(null, {emitEvent: !noEmitir});
			if (this.idNombre !== null) {
				this.form.get(this.idNombre).reset(null, { emitEvent: !noEmitir });
			}
			this.establecido.emit(this.form.get(this.name).value);
		}
		if (this.min === 0 && this.isReactive && this.form.get(this.name).value !== null) {
			this.buscar('');
		}
	}

	onBlur(ev) {
		if (ev && ev.relatedTarget && ev.relatedTarget.id.includes('mat-option')) {
			const index = Number.parseInt( ev.relatedTarget.id.substring(ev.relatedTarget.id.lastIndexOf('-') + 1, ev.relatedTarget.id.length), 10);
			this.establecer({
				option: {
					value: this.resultadosFiltrados[index]
				}
			});
		} else {
			setTimeout(() => {
				let cond: boolean;
				if (!this.isReactive) {
					cond = !this.modelo[this.name] || this.modelo[this.name].length === 0;
				} else {
					cond = !this.form.get(this.name).value || this.form.get(this.name).value.length === 0;
				}
				if (!this.isValid()) {
					this.limpiar();
					if (!cond) {
						this.componentesService.notification(`No se seleccionó ninguna opción para ${this.placeholder}`);
						if (this.required) {
							this.inputElement.nativeElement.focus();
						}
					}
				}
			}, 100);
			if (this.min > 0) {
				this.resultadosFiltrados = [];
			}
		}
	}

	isValid() {
		let hayTexto: boolean, tieneIdModelo: boolean, asignaId: boolean;
		if (this.isReactive) {
			hayTexto = this.form.get(this.name).value;
			tieneIdModelo = this.idNombre !== null && ((this.form.get(this.idNombre).value !== null && (typeof this.form.get(this.idNombre).value === 'string' && this.form.get(this.idNombre).value.length > 0)) || typeof this.form.get(this.idNombre).value === 'number');
			asignaId = this.idNombre !== null;
		} else {
			hayTexto = this.modelo[this.nombre] && this.modelo[this.nombre].length > 0;
			tieneIdModelo = this.idNombre !== null && (this.modelo[this.idNombre] !== null && (typeof this.modelo[this.idNombre] === 'string' && this.modelo[this.idNombre].length > 0));
			asignaId = this.idNombre !== null;
		}
		return ( (hayTexto && asignaId && tieneIdModelo) || (hayTexto && !asignaId && !tieneIdModelo) || (!hayTexto && asignaId && !tieneIdModelo) );
	}

	sacaChip(chip: CadaChip): void {
		const index: number = this.listaChips.indexOf(chip);
		if (index !== -1) {
			this.listaChips.splice(index, 1);
		}
/*
		const index = this.listaChips.indexOf(chip);
		if (index >= 0) {
			this.listaChips.splice(index, 1);
		}
*/
		this.chipChanges.emit(this.listaChips);

	}

	agregaChip(event: MatChipInputEvent): void {
		// Add fruit only when MatAutocomplete is not open
		// To make sure this does not conflict with OptionSelected Event
		/*
		if (!this.matAutocomplete.isOpen) {
		*/
		const input = event.input;
		const value = event.value;
		if ((value || '').trim()) {
			const last: any = this.listaChips[this.listaChips.length - 1 ];
			if (last && last._deAuto) {
				last._deAuto = false;
				last.name = value.trim();
				last.label = last.autoLabel + ':' +  value.trim();
			} else {
				this.listaChips.push({
					name: value.trim(),
					_deAuto: false,
					autoLabel: '',
					autoValue: '',
					label: value.trim()
				});
			}
			this.chipChanges.emit(this.listaChips);
		}
		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	focus() {
		if (this.readonly) {
			this.limpiarBtn.focus();
		} else {
			this.inputElement.nativeElement.focus();
		}
	}

	onFocus(event) {
		if (event.target.select) {
			event.target.select();
		}
		if (this.resultadosFiltrados.length === 0 && this.min === 0) {
			this.buscar('');
		}
	}

	destacable(resultado: any) {
		const clases = [];
		for (let i = 0; i < this.destacar.length; i++) {
			if (typeof this.destacar[i] === 'string') {
				const clase: string = this.destacar[i] as string;
				if (resultado.hasOwnProperty(this.destacar[i]) && resultado[clase]) {
					clases.push(clase);
				}
			} else {
				const destacar: Destacado = this.destacar[i] as Destacado;
				if (resultado.hasOwnProperty(destacar.atributo) && resultado[destacar.atributo]) {
					clases.push(destacar.clase);
				}
			}
		}
		return clases;
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.keyCode == 27) {
			event.preventDefault();
			event.stopPropagation();
			this.limpiar();
		}
	}

}
