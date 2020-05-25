import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, DoCheck, HostListener } from '@angular/core';
import { HttpService, UtilService } from '@app/core';
import { FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material';

@Component({
    selector: 'custom-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, DoCheck {
    modelValue: any;
    resultadosFiltrados = [];
    request = null;
    name: string;
    readonly = false;

    /** Form genérico para detectar si se transmitió FormGroup */
    formDefault = new FormGroup({});

    /** Simplifica validaciones */
    isReactive = false;

    /** Si utiliza atributo autofocus */
    @Input() autoFocus = false;

    /** tabindex, no utiliza directiva FocusNext */
    @Input() tab = -1;

    /** Clase que aplica al mat-form-field */
    @Input() clase = '';

    /** Nombre de variable a asignar en objeto "modelo", donde va el texto del autocomplete */
    @Input() nombre: string;

    /** Nombre de variable a asignar en objeto "modelo", donde va el id del resultado del autocomplete */
    @Input() idNombre: string = null;

    /** Nombre que se muestra en opciones y que se asigna a "nombre" */
    @Input() nombreResultado = 'descripcion';

    /** Nombre de variable a buscar id en resultado que se asigna a "idNombre" */
    @Input() idNombreResultado = 'id';

    @Input() eliminados = false;

    /**
     *	Primer argumento "que" de método autocomplete en HttpService
     *	Por ej: 'generos'
     */
    @Input() busca: string;

    /** Array de resultados, no se realizarán llamadas al backend */
    @Input() resultados: { label: string; value: string | number }[];

    /** Parámetros extra al realizar la petición */
    @Input() buscaExtra = '';

    /** Si es campo required */
    @Input() required = false;

    /** Texto placeholder del input */
    @Input() placeholder: string;

    /** Atributo disabled del input */
    @Input() disabled = false;

    /** Botón extra que se pone como sufijo en input */
    @Input() boton = '';

    /** Consejo que va debajo del input en texto pequeño */
    @Input() hint = '';

    /** Mínimo de caracteres necesarios para realizar la búsqueda en backend */
    @Input() min = 2;

    @Input() form: FormGroup;

    /**
     *	Función personalizada que devuelve los datos al autocomplete
     *
     *	* IMPORTANTE: Debe devolver objetos que al menos tengan atributo 'label' y 'value'
     *	* o los que se hayan especificado mediante 'nombreResultado' y 'idNombreResultado'
     */
    @Input() customSearch: Function;

    /** Emite evento con el objeto traido del backend al seleccionar una opción */
    @Output() establecido = new EventEmitter();

    /** Emite evento al realizar click en boton de sufijo */
    @Output() clickBoton = new EventEmitter();

    @Output() modeloChange = new EventEmitter();

    @ViewChild('input') inputElement: ElementRef;

    @ViewChild('limpiarBtn') limpiarBtn: MatButton;

    constructor(private httpService: HttpService, private utilService: UtilService) {}

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
        this.name = this.nombre;
        if (!this.name) {
            throw Error('No se definió name para autocomplete');
        }
        if (this.resultados && this.resultados.length < 10 && this.min <= 2) {
            this.min = 0;
            this.resultadosFiltrados = this.resultados;
        }
        if (this.isReactive) {
            this.form.get(this.name).valueChanges.subscribe(val => {
                if (!val || val.length === 0) {
                    this.readonly = false;
                    if (this.min === 0 && this.resultadosFiltrados.length === 0) {
                        if (this.isReactive && this.form.get(this.name).value !== null) {
                            this.buscar('');
                        }
                    }
                }
                if (!this.readonly) {
                    this.buscar(val);
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
                            const param = this.busca.indexOf('{') === -1 ? this.busca + busqueda : this.busca.replace('{query}', busqueda);
                            this.httpService.get(param, this.buscaExtra).then(data => {
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
                    const re = new RegExp(busqueda.toLowerCase());
                    this.resultadosFiltrados = this.resultados.filter(val => {
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
            const resultado: any = Object.assign({}, this.modelo[this.nombre]);
            if (this.isValid() || typeof resultado === 'object') {
                this.modelo[this.nombre] = resultado[this.nombreResultado];
                if (this.idNombre !== null) {
                    this.modelo[this.idNombre] = resultado[this.idNombreResultado];
                }
                this.establecido.emit(resultado);
                this.readonly = true;
            }
        } else {
            const resultado: any = ev.option.value;
            if ((this.isValid() || typeof resultado === 'object') && resultado !== undefined) {
                this.readonly = true;
                this.form.get(this.name).patchValue(resultado[this.nombreResultado]);
                if (this.idNombre !== null) {
                    this.form.get(this.idNombre).patchValue(resultado[this.idNombreResultado]);
                }
                this.establecido.emit(resultado);
            }
        }
    }

    onClickBoton(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clickBoton.emit(event);
        return false;
    }

    limpiar() {
        this.readonly = false;
        if (!this.isReactive) {
            this.modelo[this.nombre] = '';
            if (this.idNombre !== null) {
                this.modelo[this.idNombre] = '';
            }
            this.establecido.emit(this.modelo[this.nombre]);
        } else {
            this.form.get(this.name).reset();
            if (this.idNombre !== null) {
                this.form.get(this.idNombre).reset();
            }
            this.establecido.emit(this.form.get(this.name).value);
        }
        if (this.min === 0 && this.isReactive && this.form.get(this.name).value !== null) {
            this.buscar('');
        }
    }

    onBlur(ev) {
        /**
         * (Bug Material) Fix para click en option. Iba directo a blur y previene la selección
         */
        if (ev && ev.relatedTarget && ev.relatedTarget.id.includes('mat-option')) {
            const index = Number.parseInt(
                ev.relatedTarget.id.substring(ev.relatedTarget.id.lastIndexOf('-') + 1, ev.relatedTarget.id.length),
                10
            );
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
                        this.utilService.notification(`No se seleccionó ninguna opción para ${this.placeholder}`);
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
            tieneIdModelo =
                this.idNombre !== null &&
                ((this.form.get(this.idNombre).value !== null &&
                    (typeof this.form.get(this.idNombre).value === 'string' && this.form.get(this.idNombre).value.length > 0)) ||
                    typeof this.form.get(this.idNombre).value === 'number');
            asignaId = this.idNombre !== null;
        } else {
            hayTexto = this.modelo[this.nombre] && this.modelo[this.nombre].length > 0;
            tieneIdModelo =
                this.idNombre !== null &&
                (this.modelo[this.idNombre] !== null &&
                    (typeof this.modelo[this.idNombre] === 'string' && this.modelo[this.idNombre].length > 0));
            asignaId = this.idNombre !== null;
        }
        return (
            (hayTexto && asignaId && tieneIdModelo) ||
            (hayTexto && !asignaId && !tieneIdModelo) ||
            (!hayTexto && asignaId && !tieneIdModelo)
        );
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

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            if (this.readonly) {
                event.preventDefault();
                event.stopPropagation();
                this.limpiar();
            }
        }
    }
}