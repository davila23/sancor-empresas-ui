import { Component, Inject, Optional, OnInit, ViewChild, Input, EventEmitter, Output, HostListener, ViewChildren, QueryList, AfterViewInit, AfterViewChecked, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { collapsible } from './collapsible.animation';
import { MatTableDataSource, MatPaginator, MatSort, MatBottomSheet, MatMenuTrigger } from '@angular/material';
import { HttpService } from '../http.service';
import { InputBSComponent } from '../inputbs';
import { NumformPipe } from '@tres-erres/ngx-utils';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith, switchMap, map } from 'rxjs/operators';
import { ColumnaHojeador, HojeadorPrefs } from './interfaces';
import { ComponentesService } from '../componentes.service';
import { Accion } from '../interfaces';

export const BASE_URL = '';


/**
 * TODO: Que loading saque offset de tabla para asignar top, bottom, left y right
 */
@Component({
	selector: 'tr-hojeador',
	templateUrl: './hojeador.component.html',
	styleUrls: ['./hojeador.component.scss'],
	animations: [ collapsible ],
	encapsulation: ViewEncapsulation.None
})
export class HojeadorComponent implements OnInit, AfterViewInit, AfterViewChecked {
	constructor(
		private httpService: HttpService,
		private componentesService: ComponentesService,
		@Optional() @Inject('baseUrl') private baseUrl: string,
		private bottomSheet: MatBottomSheet
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

	/** Número de acciones para que se agrupen en un menú */
	@Input() accionesMinimo = 3;

	@Input() nombreDatos = 'todos';

	@Input() nombreCuantas = 'cuantas';

	/** Definición de columnas de tabla primaria */
	@Input() columnas: ColumnaHojeador[] = [];

	/** Resultados por página */
	@Input() cuantos = 10;

	/** Si muestra checkbox y emite eventos */
	@Input() selecciona = false;

	/** Nombre del campo que referencia al id. Ej: "ctid" */
	@Input() nombreCampoId = 'id';

	/** Nombre del campo que referencia al nombre. Ej: "ctnombre" */
	@Input() nombreCampoDenominacion = 'denominacion';

	/** Retornar el objeto completo al seleccionar  */
	@Input() retornarObjetoCompleto = false;

	/** "Elementos seleccionados": 1 */
	@Input() nombreElementosSeleccionados = 'Elementos seleccionados';

	/** Si hace efecto al hover y busca detalle */
	@Input() detalla = false;

	/** Si se incluye un buscador y agregar campo 'texto' a las requests */
	@Input() busca = true;

	/** Array de acciones (tabla primaria) */
	@Input() acciones: Accion[] = [];

	/** Si se detalla, esta es la estructura de la subtabla */
	@Input() columnasSubtabla: ColumnaHojeador[] = [];

	/** Array de acciones de la subtabla */
	@Input() accionesSubtabla: Accion[] = [];

	/** Ruta query. Ej: admin/hojear/usuarios */
	@Input() url = '';

	/** Si muestra un toggle como acción en cada fila  */
	@Input() toggle = null;

	/** Si está contenido en un sidenav, por scrolling */
	@Input() sidenav = false;

	/** Si cambia pagina al mover la rueda */
	@Input() scrollable = true;

	/** Si usa matTooltip en lugar de title para acción */
	@Input() matTooltip = false;

	/** Si se utiliza un disparador personalizado para expandir el detalle */
	@Input() detalleCustomTrigger = false;

	/** Si realiza las peticiones por POST, caso contrario, GET */
	@Input() post = true;

	@Input() mostrarPeso = false;

	/** Permite desactivar la ordenacion de la tabla */
	@Input() sortable = true;

	@Input() rellena = true;

	/** Emite evento cada vez que cambian los itemsSeleccionados */
	@Output() seleccion = new EventEmitter();

	inicializado = false;

	headers = [];
	dataSource = new MatTableDataSource();
	resultsLength = 0;
	isLoading = false;
	browserRequest;
	itemsSeleccionados = { ids: [], denominacion: [] };
	columna = null;
	direccion = null;
	permisos: any = {};
	search = '';

	expandedElement = [];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChildren(MatMenuTrigger) matMenuTriggers: QueryList<MatMenuTrigger>;

	/** Función que brinda el componente padre para modificar los datos al refrescar */
	@Input() modificarDatos: Function = (datos) => datos;

	/** Función que brinda el componente padre para obtener los parámetros de la query */
	@Input() getDatos: Function = () => Object.create({});

	/** Formatea la respuesta que llega de la petición */
	@Input() formateaRespuesta: Function = (data) => data;

	/** Función que brinda el componente padre para obtener los parámetros de la query */
	@Input() buscarDetalle: Function = (): Promise<any> => new Promise(resolve => { resolve(); });

	ngOnInit() {
		this.inicializado = this.columnas && this.columnas.length > 0;
	}

	async ngAfterViewInit() {
		await this.ngAfterViewChecked();
		return;
	}

	async ngAfterViewChecked() {
		return;
	}

	init(datos: HojeadorPrefs) {
		this.isLoading = true;
		this.ngAfterViewInit().then(() => {
			this.actualizarDatos(datos, false);
			merge(this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
						this.isLoading = true;
						const data = this.setDatos();
						let req: Promise<any>;
						if (this.post) {
							req = this.httpService.post(this.url, data);
						} else {
							req = this.httpService.get(this.url, data);
						}
						return req;
					}),
					map((data: any) => {
						data = this.formateaRespuesta(data);
						this.isLoading = false;
						if (data) {
							this.resultsLength = this.nombreCuantas ? data[this.nombreCuantas] : (data.cuantas ? data.cuantas : 0);
							this.permisos = data.permisos ? data.permisos : {};
							return this.nombreDatos ? data[this.nombreDatos] : data;
						} else {
							console.error('No hubo respuesta del servidor');
							return [];
						}
					})
				).subscribe(datos => {
					datos = datos ? this.modificarDatos(datos) : [];
					if (datos.length < this.cuantos && datos.length > 0) {
						this.dataSource.data = this.rellenar(datos);
					} else {
						this.dataSource.data = datos;
					}
					this.inicializado = true;
				});
		});
	}

	/**
	 * quepagina: a que página ir.
	 *
	 */

	irPagina(quepagina) {
		this.paginator.pageIndex = quepagina;
	}

	actualizarDatos(datos, refresh?: boolean) {
		for (const key in datos) {
			if (datos.hasOwnProperty(key)) {
				const dato = datos[key];
				this[key] = dato;
			}
		}
		this.firstPage();
		if (refresh === false) {
			return;
		}
		if (this.inicializado) {
			this.refreshTable(false);
		}
	}

	actualizarHeaders() {
		/**
		 * Si hay acciones y la última columna no está definida como "acciones".
		 * Útil cuando se quiere especificar un ancho para "acciones"
		 */
		if ((this.selecciona || this.acciones.length > 0) && this.columnas[this.columnas.length - 1].def !== 'acciones') {
			this.columnas.push({def: 'acciones', nombre: 'Acciones', tipo: null});
		}
		this.headers = this.columnas.map((columna) => {
			return columna.def;
		});

		this.cargarAnchos();
	}

	/**
	 * preSeleccionar ids
	 * @param queids : array de ids a marcar
	 */
	preSeleccionar(queids) {
		// this.itemsSeleccionados.ids = [];
		// this.itemsSeleccionados.denominacion = [];
		this.dataSource.data.forEach((element: any) => {
			if (queids.indexOf(element[this.nombreCampoId]) >= 0) {
				if (this.itemsSeleccionados.ids.indexOf(element[this.nombreCampoId]) < 0) {
					if (this.retornarObjetoCompleto) {
						this.itemsSeleccionados.ids.push(element);
					} else {
						this.itemsSeleccionados.ids.push(element[this.nombreCampoId]);
						this.itemsSeleccionados.denominacion.push(element[this.nombreCampoDenominacion]);
					}
				}
			}
		});
	}

	marcar(que) {
		if (que === 'reiniciar') {
			this.itemsSeleccionados.ids = [];
			this.itemsSeleccionados.denominacion = [];
		} else {
			if (que === 'todas') {
				const datos = this.setDatos();
				datos.ids = null;
				this.isLoading = true;
				this.httpService.post(this.url, datos).then(data => {
					this.isLoading = false;
					const arrDatos = this.nombreDatos ? data[this.nombreDatos] : data;
					if (arrDatos) {
						arrDatos.forEach((element: any) => {
							if (this.retornarObjetoCompleto) {
								if (!this.itemsSeleccionados.ids.find(x => x[this.nombreCampoId] == element[this.nombreCampoId])) {
									this.itemsSeleccionados.ids.push(element);
								}
							} else {
								if (this.itemsSeleccionados.ids.indexOf(element[this.nombreCampoId]) < 0) {
									this.itemsSeleccionados.ids.push(element[this.nombreCampoId]);
									this.itemsSeleccionados.denominacion.push(element[this.nombreCampoDenominacion]);
								}
							}
						});
					}
				});
			} else if (que === 'pagina') {
				this.dataSource.data.forEach((element: any) => {
					if (element[this.nombreCampoId]) {
						if (this.retornarObjetoCompleto) {
							if (!this.itemsSeleccionados.ids.find ( x => x[this.nombreCampoId] == element[this.nombreCampoId])) {
								this.itemsSeleccionados.ids.push(element);
							}
						} else if (this.itemsSeleccionados.ids.indexOf(element[this.nombreCampoId]) < 0) {
								this.itemsSeleccionados.ids.push(element[this.nombreCampoId]);
								this.itemsSeleccionados.denominacion.push(element[this.nombreCampoDenominacion]);
						}
					}
				});
			}
		}
		this.seleccion.emit(this.itemsSeleccionados);
	}

	check(element: any, checked: boolean) {
		if (checked) {
			if (this.retornarObjetoCompleto) {
				this.itemsSeleccionados.ids.push(element);
			} else {
				this.itemsSeleccionados.ids.push(element[this.nombreCampoId]);
				this.itemsSeleccionados.denominacion.push(element[this.nombreCampoDenominacion]);
			}
		} else {
			if (this.retornarObjetoCompleto) {
				this.itemsSeleccionados.ids = this.itemsSeleccionados.ids.filter((item) => {
					return element[this.nombreCampoId] !== item[this.nombreCampoId];
				});
			} else {
				this.itemsSeleccionados.ids = this.itemsSeleccionados.ids.filter((item, index) => {
					if (element[this.nombreCampoId] === item) {
						delete this.itemsSeleccionados.denominacion[index];
					}
					return element[this.nombreCampoId] !== item;
				});
			}
		}
		this.seleccion.emit(this.itemsSeleccionados);
	}

	checked(element: any) {
		if (this.retornarObjetoCompleto) {
			return this.itemsSeleccionados.ids.find ((item) => item[this.nombreCampoId] === element[this.nombreCampoId]);
		} else {
			return this.itemsSeleccionados.ids.indexOf(element[this.nombreCampoId]) >= 0;
		}
	}

	setDatos() {
		const datos = this.getDatos();
		if (!datos.cuantos) {
			datos.cuantos = this.cuantos;
		}
		if (!datos.texto) {
			datos.texto = this.search;
		}
		if (this.paginator) {
			datos.pag = this.paginator.pageIndex;
		} else {
			datos.pag = 0;
		}
		datos.columna = this.columna;
		datos.direccion = this.direccion;
		this.actualizarHeaders();
		return datos;
	}

	refreshTable(saltear_espera?: Boolean) {
		this.isLoading = true;
		clearTimeout(this.browserRequest);
		this.browserRequest = setTimeout(() => {
			let req: Promise<any>;
			if (this.post) {
				req = this.httpService.post(this.url, this.setDatos());
			} else {
				req = this.httpService.get(this.url, this.setDatos());
			}
			req.then(data => {
				data = this.formateaRespuesta(data);
				this.resultsLength = this.nombreCuantas ? data[this.nombreCuantas] : (data.cuantas ? data.cuantas : 0);
				this.permisos = data.permisos ? data.permisos : {};
				data = this.nombreDatos ? data[this.nombreDatos] : data;
				data = data ? this.modificarDatos(data) : [];
				if (data.length < this.cuantos && data.length > 0) {
					this.dataSource.data = this.rellenar(data);
				} else {
					this.dataSource.data = data;
				}
				this.isLoading = false;
				if(this.resultsLength <= this.paginator.pageSize * this.paginator.pageIndex){
					this.firstPage();
				}

			});
		}, saltear_espera ? 0 : 400);
	}

	vaciarHojeador() {
		this.dataSource.data = [];
		this.resultsLength = 0;
	}

	rellenar(datos) {
		if (this.rellena) {
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
		} else {
			return datos;
		}
	}

	estaVacio(element) {
		return Object.values(element).every((item) => item === null);
	}

	cambiaOrden(event) {
		if (event.direction.length > 0) {
			this.columna = event.active;
			this.direccion = event.direction;
		} else {
			this.columna = null;
			this.direccion = null;
		}
		this.refreshTable(true);
	}

	numForm(valor, borrarceros) {
		return new NumformPipe().transform(valor, borrarceros);
	}

	preview() {
		if (this.itemsSeleccionados.ids.length > 20) {
			return '';
		} else {
			let title = '';
			this.itemsSeleccionados.denominacion.forEach(element => {
				title += element + `
`;
			});
			return title;
		}
	}

	modifica(elemento, columna) {
		elemento.editando = true;
		if (columna.modificaDatos && columna.modificaDatos.procesa) {
			elemento = columna.modificaDatos.procesa(elemento, columna);
		}
		if (elemento === false) {
			return false;
		}
		let data: any = {
			value: elemento[columna.def],
			placeholder: columna.nombre,
			tipo: 'input'
		};
		data = columna.modificaDatos && columna.modificaDatos.datosBS ? Object.assign(data, columna.modificaDatos.datosBS) : data;
		if (columna.modificaDatos && columna.modificaDatos.busca) {
			data.busca = columna.modificaDatos.busca;
			data.tipo = 'autocomplete';
		} else if (columna.modificaDatos && columna.modificaDatos.datos) {
			data.resultados = columna.modificaDatos.datos();
			data.tipo = 'autocomplete';
		}
		if (!data.nombre) {
			data.nombre = 'value';
		}
		this.bottomSheet.open(InputBSComponent, { data }).afterDismissed().subscribe((res) => {
			if (columna.modificaDatos && columna.modificaDatos.actualiza) {
				columna.modificaDatos.actualiza(elemento, columna, res);
			}
			elemento.editando = false;
		});
	}

	detallar(elemento, event: any) {
		if (this.detalla && !this.estaVacio(elemento)) {
			if (event !== null) {
				event.preventDefault();
			}
			if (event === null || (!event.target.className.includes('checkbox') && !event.target.className.includes('accion') && this.detalla)) {
				if (!elemento.detalles) {
					this.isLoading = true;
					this.buscarDetalle(elemento).then((detalles) => {
						if (detalles && detalles.length > 0) {
							elemento.detalles = detalles;
							if (event && event.ctrlKey) {
								this.expandedElement.push(elemento);
							} else {
								this.expandedElement = [elemento];
							}
						} else {
							elemento.detalles = [];
							this.componentesService.notification('No existe detalle para esta fila');
						}
						this.isLoading = false;
					});
				} else if (this.expandedElement.some((element) => element === elemento)) {
					if (event && event.ctrlKey) {
						this.expandedElement = this.expandedElement.filter((element) => element !== elemento);
					} else {
						this.expandedElement = [];
					}
				} else if (elemento.detalles.length > 0) {
					if (event && event.ctrlKey) {
						this.expandedElement.push(elemento);
					} else {
						this.expandedElement = [elemento];
					}
				} else {
					this.componentesService.notification('No existe detalle para esta fila');
				}
			}
		}
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

	modificaAncho(columna, oper, event) {
		event.stopPropagation();
		if (!columna.ancho) {
			this.columnas.forEach(col => {
				if (col !== columna) {
					col.ancho = Math.floor(100 / this.columnas.length);
				}
				this.guardaAnchos(col);
			});
			columna.ancho = Math.floor(100 / this.columnas.length) + ((oper === 'mas') ? 1 : -1);
		} else {
			columna.ancho += (oper === 'mas') ? 1 : -1;
		}
		this.guardaAnchos(columna, oper);
	}

	borraAncho(columna) {
		if (columna.ancho) {
			const anchosTablas: any = JSON.parse(localStorage.getItem('anchosTablas'));
			this.columnas.forEach(col => {
				if (col === columna) {
					if (anchosTablas[this.url] && anchosTablas[this.url][columna.def] && anchosTablas[this.url][columna.def]['original']) {
						col.ancho = anchosTablas[this.url][columna.def]['original'];
						delete anchosTablas[this.url][columna.def];
						localStorage.setItem('anchosTablas', JSON.stringify(anchosTablas));
					}
				}
			});
		}
	}

	guardaAnchos(columna, oper?) {
		let anchosTablas: any = localStorage.getItem('anchosTablas');
		if (!anchosTablas) {
			anchosTablas = {};
		} else {
			anchosTablas = JSON.parse(anchosTablas);
		}
		this.columnas.forEach((col) => {
			if (col === columna) {
				if (!anchosTablas[this.url]) {
					anchosTablas[this.url] = {};
				}
				if (!anchosTablas[this.url][columna.def]) {
					anchosTablas[this.url][columna.def] = {};
				}
				if (!anchosTablas[this.url][columna.def]['original']) {
					anchosTablas[this.url][columna.def]['original'] = columna.ancho;
					if (oper) {
						anchosTablas[this.url][columna.def]['original'] += (oper === 'mas') ? -1 : 1;
					}
				}
				anchosTablas[this.url][columna.def]['modificado'] = columna.ancho;
			}
		});
		localStorage.setItem('anchosTablas', JSON.stringify(anchosTablas));
	}

	cargarAnchos() {
		let anchosTablas: any = localStorage.getItem('anchosTablas');
		if (!anchosTablas) {
			return;
		} else {
			anchosTablas = JSON.parse(anchosTablas);
		}
		this.columnas.forEach((col) => {
			if (anchosTablas[this.url] && anchosTablas[this.url][col.def] !== undefined) {
				col.ancho = anchosTablas[this.url][col.def]['modificado'];
			}
		});
	}

	clasesRow(row) {
		const clases = {
			'fila-expandible': this.detalla,
			'fila-expandida': this.expandedElement.indexOf(row) !== -1,
			'editando': row.editando
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

	firstPage() {
		this.ngAfterViewInit().then(() => {
			this.paginator.firstPage();
		});
	}

	@HostListener('wheel', ['$event']) // Firefox
	@HostListener('mousewheel', ['$event']) // Chrome
	onScroll(event) {
		if (!this.hayScroll(this.sidenav) && this.scrollable && this.expandedElement.length === 0) {
			if ((event.target.className instanceof SVGAnimatedString || this.parents(event.target, '.mat-table') || event.target.className.includes('loading')) && (!this.hayScroll() && !this.hayScroll(true))) {
				event.preventDefault();
				if (event.deltaY < 0 && this.paginator.hasPreviousPage()) {
					this.paginator.pageIndex--;
					this.refreshTable();
				} else if (event.deltaY > 0 && this.paginator.hasNextPage()) {
					event.preventDefault();
					this.paginator.pageIndex++;
					this.refreshTable();
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
