import { Component, EventEmitter, Inject, Optional, OnInit, ViewChild, Input, Output, HostListener, ViewEncapsulation, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatMenuTrigger, MatTable, MatButton } from '@angular/material';
import { HttpService } from '../http.service';
import { NumformPipe } from '@tres-erres/ngx-utils';
import { ColumnaTable, ABMTablePrefs } from './interfaces';
import { ComponentesService } from '@componentes/componentes.service';
import { Accion } from '@componentes/interfaces';

export const BASE_URL = '';

/**
 * Para utilizar este componente hay que declarar una clase del modelo
 * que se tratará en el ABM. La misma deberá tener sus propiedades públicas
 * y dos métodos obligatorios: "reset" y "validar".
 * Reset: sólo no deberá devolver "false"
 * Validar: tiene el objetivo de llegar o no al servidor
 */
@Component({
	selector: 'tr-abmtable',
	templateUrl: './abmtable.component.html',
	styleUrls: ['./abmtable.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ABMTableComponent implements OnInit, AfterViewInit {

	constructor(
		private httpService: HttpService,
		private componentesService: ComponentesService,
		@Optional() @Inject('baseUrl') private baseUrl: string,
	) {
		if (!this.httpService['baseUrl'] && (!this.baseUrl || this.baseUrl.length === 0)) {
			throw new Error('No está definida la constante baseUrl');
		} else {
			if (this.baseUrl && this.baseUrl.length > 0) {
				this.httpService['baseUrl'] = this.baseUrl;
			}
			this.actualizarHeaders();
		}
	}

	inicializado = false;
	headers = [];
	dataSource = new MatTableDataSource();
	resultsLength = 0;
	columna = null;
	direccion = null;
	permisos: any = {};
	expandedElement = [];
	editando: any = null;
	accionesDefault: Accion[] = [
		{
			icon: () => 'edit',
			handler: (row) => { this.editRow(row); },
			title: () => 'Editar'
		},
		{
			icon: () => 'delete',
			handler: (row) => { this.removeRow(row); },
			title: () => 'Eliminar'
		},
	];

	modeloValue: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChildren(MatMenuTrigger) matMenuTriggers: QueryList<MatMenuTrigger>;
	@ViewChild('submitBtn') submitBtn: MatButton;
	@ViewChild(MatTable) matTable: MatTable<any>;

	@Output() modeloChange = new EventEmitter();

	/** Definición de columnas de tabla primaria */
	@Input() columnas: ColumnaTable[] = [];

	/** Resultados por página */
	@Input() cuantos = 10;

	/** Array de acciones (tabla primaria) */
	@Input() acciones: Accion[] = [];

	/** Si está contenido en un sidenav, por scrolling */
	@Input() sidenav = false;

	/** Si pagina al mover la rueda */
	@Input() scrollable = false;

	/** Array desde el que se popula el DataSource */
	@Input() datos: any[] = [];

	/** Establece si mostrar el formulario o no */
	@Input() abm = true;

	/** Establece si mostrar el prefijo $ cuando es un monto */
	@Input() mostrarPeso = false;

	/**
	 * Función que hace focus al primer elemento del formulario
	 */
	@Input() focusFirst?: Function = (() => null);

	/** Función que reinicia el modelo */
	@Input() resetModelo?: Function = (() => false);

    /** Función que es llamada al insertar una row. Un retorno false indica que no debe ser añadida */
	@Input() onAdd?: Function = (): Promise<any> => new Promise(resolve => { resolve(); });

	/** Función que es llamada al eliminar una row. Un retorno false indica que no debe ser removida */
	@Input() onRemove?: Function = (): Promise<any> => new Promise(resolve => { resolve(); });

	@Input()
	get modelo() {
		return this.modeloValue;
	}

	set modelo(val) {
		this.modeloValue = val;
		this.modeloChange.emit(this.modeloValue);
	}

	ngOnInit() {
		this.inicializado = this.columnas && this.columnas.length > 0;
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	async ngAfterViewInit() {
		return;
	}

	init(datos: ABMTablePrefs) {
		this.ngAfterViewInit().then(() => {
			this.actualizarDatos(datos);
			this.dataSource.data = this.datos;
			if (!datos.acciones && this.acciones.length === 0) {
				this.acciones = this.accionesDefault;
			}
			if (!datos.columnas && this.columnas.length === 0 && this.datos.length > 0) {
				this.abm = false;
				this.definirColumnas();
			}
			this.actualizarHeaders();
			this.inicializado = true;
		});
	}

	/**
	 * Utilizar apropiadamente resolve y reject
	 * @param objeto Referencia del objeto perteneciente a la row
	 */
	addRow() {
		let valido = true;
		if (typeof this.modelo.validar === 'function') {
			valido = this.modelo.validar();
		}
		if (valido) {
			this.onAdd(this.modelo).then(() => {
				if (this.editando === null) {
					this.datos.push(Object.assign({}, this.modelo));
				} else {
					this.datos.forEach((item) => {
						if (item === this.editando) {
							item = Object.assign({}, this.modelo);
						}
					});
					this.editando = null;
				}
				this.dataSource.data = this.datos;
				this.reset();
			});
		} else {
			this.componentesService.notification('Formulario no válido, revise por favor');
			this.focusFirst();
		}
	}

	/**
	 * Utilizar apropiadamente resolve y reject
	 * @param objeto Referencia del objeto perteneciente a la row
	 */
	removeRow(objeto?) {
		if (!objeto) {
			objeto = this.datos.slice()[0];
		}
		if (typeof objeto === 'number' ) {
			objeto = this.datos.slice(objeto)[0];
		}
		if (!objeto) {
			return false;
		}
		this.onRemove(objeto).then(() => {
			if (this.editando === null) {
				this.datos = this.datos.filter((item) => item !== objeto);
			} else {
				if (this.editando === objeto) {
					this.reset();
				}
				this.datos = this.datos.filter((item) => item !== objeto);
				this.editando = null;
			}
			this.dataSource.data = this.datos;
		});
	}

	editRow(objeto) {
		this.editando = objeto;
		this.modelo = Object.assign({}, objeto);
	}

	actualizarDatos(datos) {
		for (const key in datos) {
			if (datos.hasOwnProperty(key)) {
				const dato = datos[key];
				this[key] = dato;
			}
		}
		this.paginator.firstPage();
	}

	actualizarHeaders() {
		/**
		 * Si hay acciones y la última columna no está definida como "acciones".
		 * Útil cuando se quiere especificar un ancho para "acciones"
		 */
		if (this.acciones.length > 0 && this.columnas[this.columnas.length - 1].def !== 'acciones') {
			this.columnas.push({def: 'acciones', nombre: 'Acciones', tipo: null});
		}
		this.headers = this.columnas.map((columna) => {
			return columna.def;
		});
	}

	rellenar(datos) {
		const rows = [];
		datos.forEach(element => {
			rows.push(element);
		});
		const cantidad = rows.length;
		for (let i = 0; i < (this.cuantos - cantidad); i++) {
			const obj = {};
			this.columnas.forEach(col => {
				obj[col.def] = null;
			});
			rows.push(obj);
		}
		return rows;
	}

	estaVacio(element) {
		return Object.values(element).every((item) => item === null);
	}

	numForm(valor, borrarceros) {
		return new NumformPipe().transform(valor, borrarceros);
	}

	comprobarPermiso(nombrePermiso): boolean {
		return this.permisos.hasOwnProperty(nombrePermiso) && this.permisos[nombrePermiso];
	}

	menuHeader(columna, event) {
		event.preventDefault();
		this.matMenuTriggers.forEach((trigger) => {
			if (trigger.menuData && trigger.menuData.columna === columna) {
				trigger.openMenu();
			}
		});
	}

	goToSubmit() {
		this.submitBtn.focus();
	}

	reset(event?) {
		if (event) {
			event.preventDefault();
		}
		if (typeof this.modelo.reset !== 'function') {
			for (const key in this.modelo) {
				if (this.modelo.hasOwnProperty(key)) {
					if (typeof this.modelo[key] === 'string') {
						this.modelo[key] = '';
					} else {
						this.modelo[key] = null;
					}
				}
			}
		} else {
			this.modelo.reset();
		}
		this.editando = null;
		this.focusFirst();
	}

	restart() {
		if (this.abm) {
			this.reset();
		}
		this.datos = [];
		this.refreshTable();
	}

	definirColumnas() {
		const row = this.datos[0];
		for (const key in row) {
			if (row.hasOwnProperty(key)) {
				this.columnas.push({
					def: key,
					nombre: key,
					tipo: 'texto'
				});
			}
		}
	}

	refreshTable() {
		this.dataSource.data = this.datos;
		this.paginator.firstPage();
	}

	clasesRow(row) {
		const clases = {
			// 'fila-expandible': this.detalla,
			// 'fila-expandida': this.expandedElement.indexOf(row) !== -1,
			'editando': this.editando === row
		};
		if (row.clase) {
			if (typeof row.clase === 'string') {
				clases[row.clase] = true;
			} else {
				row.clase.forEach(element => {
					clases[element] = true;
				});
			}
		}
		return clases;
	}

	@HostListener('wheel', ['$event']) // Firefox
	@HostListener('mousewheel', ['$event']) // Chrome
	onScroll(event) {
		if (!this.hayScroll(this.sidenav) && this.scrollable) {
			if ((event.target.className instanceof SVGAnimatedString || this.parents(event.target, '.mat-table') || event.target.className.includes('loading')) && (!this.hayScroll() && !this.hayScroll(true))) {
				if (event.deltaY < 0 && this.paginator.hasPreviousPage()) {
					event.preventDefault();
					this.paginator.pageIndex--;
				} else if (event.deltaY > 0 && this.paginator.hasNextPage()) {
					event.preventDefault();
					this.paginator.pageIndex++;
				}
			}
		}
	}

	private hayScroll(sidenav?: boolean) {
		if (sidenav) {
			return document.querySelector('tr-hojeador').clientHeight + 64 > window.innerHeight;
		} else {
			return document.body.clientHeight > window.innerHeight;
		}
	}

	private parents(element: string | any, parent: string) {
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
}
