import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CabeceraConvenioDTO } from '@app/models/cabecera-convenio.model';
import { PlanConvenidoDTO } from '@app/models/planes-convenidos.model';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { PlanDTO } from '@app/models/plan.model';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { ProductoDTO } from '@app/models/producto.model';
import { MaestroPlanDTO } from '@app/models/maestro-plan.model';
import { UtilService } from '@app/core';

@Component({
	selector: 'detalle-planes-convenidos',
	templateUrl: './detalle-planes-convenidos.component.html',
	styleUrls: ['./detalle-planes-convenidos.component.scss']
})
export class DetallePlanesConvenidosComponent implements OnInit {

	constructor(private _fb: FormBuilder,
		private planesConvenidosService: PlanesConvenidosService,
		private subsidiosService: SubsidiosService,
		private utilService: UtilService) {

		this.planesConvenidosForm = this._fb.group({
			cantMeses: [''],
			bonificacionRecaudo: [''],
			porcentaje: [0, [Validators.required, Validators.min(0.00), Validators.max(99.99)]],
			producto: ['', [Validators.required]],
			plan: ['', [Validators.required]]
		});

	}

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	}
	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set convenioId(convenioId) {
		setTimeout(() => {
			this.convenioIdFlag = convenioId;
			this.fillPlanesConvenidos();
		});
	}

	@Input() set isAllowedToEdit(boolean) {
		setTimeout(() => {
			this.edit = boolean;
		});
	} edit = false;

	@Input() set isAllowedToDelete(boolean) {
		setTimeout(() => {
			this.delete = boolean;
		});
	} delete = false;

	@Output() changeEditionFlag = new EventEmitter<boolean>();

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.entidad_pag = mp;
		this.cabeceraDataSource.paginator = this.entidad_pag;
	}

	private entidad_pag: MatPaginator;

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	planesConvenidosForm: FormGroup;
	cabeceraDataSource = new MatTableDataSource<any>([]);
	productoCtrl = new FormControl();
	filteredProductos: Observable<any[]>;
	planesList: PlanDTO[] = [];
	productosList: ProductoDTO[];
	cabeceraConvenio: CabeceraConvenioDTO = null;
	dialogRef = null;

	edicionPlanExistente: boolean = false;
	currentPlan: any = null;

	ngOnInit(): void {

		this.planesConvenidosService.getProductosPlanesConvenidos()
			.subscribe(result => {
				this.productosList = result["listaResultado"];
			});

		this.filteredProductos = this.productoCtrl.valueChanges
			.pipe(startWith(''),
				switchMap(value => {
					if (typeof value === "object") value = this.productoCtrl.value.descripcion;

					if (value !== '') return this.lookup(value);
					else return of(null);
				})
			);
	}

	fillPlanesConvenidos() {
		this.isPosting = true;

		this.planesConvenidosService.getCabeceraConvenioD(this.convenioIdFlag)
			.subscribe(res => {
				console.log('cabecera', res);
				if (res != null && res.length > 0) {
					this.cabeceraConvenio = res[0];
					var myJSON = JSON.stringify(res[0]);
					this.planesConvenidosService.getPlanesConvenidosD(res[0])
						.subscribe(res => {
							console.log('Planes convenidos list', res);
							if (res == null) res = [];

							this.cabeceraDataSource.data = res;
						})
						.add(() => {
							this.isPosting = false;
						});
				}
			}).add(() => {
				this.isPosting = false;
			});

	}

	lookup(value: string): Observable<ProductoDTO[]> {
		return this.subsidiosService.getListaProductos(value.toLowerCase()).pipe(
			map(results => results["listaResultado"]),
			catchError(_ => {
				return of(null);
			})
		);
	}

	onEnter(evt: any) {

		if (evt.source.selected) {
			this.isPosting = true;
			this.planesList = [];
			this.planesConvenidosForm.controls['plan'].setValue(null);
			let codigo = evt.source.value.codigo;
			console.log(codigo);
			this.subsidiosService.getListaPlanesByProducto(codigo)
				.subscribe(
					result => {
						console.log(result);
						this.planesList = result["listaResultado"];
					})
				.add(() => {
					this.isPosting = false;
				});
		}
	}
	//cabeceraList: any = [];
	cabeceraDisplayedColumns = [
		'planDescripcion',
		'producto',
		'porcentaje',
		'delete'
	];

	bonificacionRecaudoList: { id: string, descripcion: string }[] = [
		{ id: "", "descripcion": "-- Seleccionar --" },
		{ id: "B", "descripcion": "Bonificacion" },
		{ id: "R", "descripcion": "Recaudo" }
	];

	changeBonificacionRecaudo(data) {
		this.bonificacionRecaudo = data.value;
	}

	bonificacionRecaudo = '';

	cantGruposDTO = '';
	cantIntegrantes = '';
	porcentaje = '';
	vigenciaDesde = '';
	vigenciaHasta = '';


	planesCabeceraSaveAndRender() {

		if (this.planesConvenidosForm.invalid) {
			(<any>Object).values(this.planesConvenidosForm.controls).forEach(control => {
				control.markAsTouched();
			});
			return
		}

		if (this.planesConvenidosForm.valid) {

			this.isPosting = true;

			let planConvenido = new PlanConvenidoDTO();
			planConvenido.edicion = false;
			//console.log(this.planesConvenidosForm.value["producto"]["codigo"]);
			planConvenido.producto = this.planesConvenidosForm.value["producto"]["codigo"];
			planConvenido.cantidadMeses = 0;//this.planesConvenidosForm.value["cantMeses"];
			planConvenido.plan = new MaestroPlanDTO();
			planConvenido.plan.codigo = this.planesConvenidosForm.value["plan"]["codigo"];
			planConvenido.plan.descripcion = this.planesConvenidosForm.value["plan"]["descripcionParaSocio"];

			// console.log(this.planesConvenidosForm.value["plan"]);
			planConvenido.planId = 1;

			planConvenido.porcentaje = this.planesConvenidosForm.value["porcentaje"]; //this.planesConvenidosForm.value["porcentaje"];
			planConvenido.porcentajeBonificacion = 1;
			planConvenido.bonificacionRecaudo = 'B'; //this.planesConvenidosForm.value["bonificacionRecaudo"];

			console.log(this.cabeceraConvenio, 'cabecera antes enviar plan');

			if (this.cabeceraConvenio == null) {
				/*Si no tiene cabecera le creo una*/
				let empresa = new EmpresaDTO();
				empresa.id = this.empresaIdFlag;
				let cabecera = new CabeceraConvenioDTO();
				cabecera.empresa = empresa;
				cabecera.idConvenio = this.convenioIdFlag;
				cabecera.cantidadGruposParaBonificar = 1;
				cabecera.porcentaje = 0;
				cabecera.cantidadIntegrantesParaBonificar = 1;
				cabecera.vigencia = new Date();

				this.planesConvenidosService.addCabeceraConvenioD(cabecera)
					.subscribe(res => {
						console.log('addCabecera', res);
						this.planesConvenidosService.getCabeceraConvenioD(this.convenioIdFlag)
							.subscribe(res => {
								console.log('getCabecera', res);
								this.cabeceraConvenio = res[0];
								planConvenido.cabecera = this.cabeceraConvenio;
								planConvenido.vigencia = this.cabeceraConvenio.vigencia;
								this.planesConvenidosService.addPlanConvenidoD(planConvenido)
									.subscribe(res => {
										if (res.length == 0) {
											this.utilService.notification('¡Registro añadido con éxito!', 'success', 4000);
											//this.planesConvenidosService.getPlanesConvenidosD(res[0])
											this.planesConvenidosService.getPlanesConvenidosD(this.cabeceraConvenio)
												.subscribe(res => {
													if (res == null) res = [];
													this.cabeceraDataSource.data = res;
												});
										} else {
											this.utilService.openConfirmDialog(
												{
													titulo: 'No fue posible completar la acción',
													texto: res[0].detalle,
													confirmar: 'ACEPTAR'
												});

										}

									}).add(() => {
										this.isPosting = false;
									});
							});
					});
			} else {
				planConvenido.cabecera = this.cabeceraConvenio;
				planConvenido.vigencia = this.cabeceraConvenio.vigencia;
				planConvenido.cantidadGruposParaBonificar = this.cabeceraConvenio.cantidadGruposParaBonificar;
				planConvenido.cantidadIntegrantesParaBonificar = this.cabeceraConvenio.cantidadIntegrantesParaBonificar;
				this.planesConvenidosService.addPlanConvenidoD(planConvenido)
					.subscribe(res => {
						if (res.length == 0) {
							this.planesConvenidosService.getCabeceraConvenioD(this.convenioIdFlag)
								.subscribe(res => {
									this.utilService.notification('¡Registro añadido con éxito!', 'success', 4000);
									this.planesConvenidosService.getPlanesConvenidosD(res[0])
										.subscribe(res => {
											if (res == null) res = [];
											this.cabeceraDataSource.data = res
										});
								}).add(() => {
									this.isPosting = false;
								});
						} else {
							this.utilService.openConfirmDialog(
								{
									titulo: 'No fue posible completar la acción',
									texto: res[0].detalle,
									confirmar: 'ACEPTAR'
								});
						}
					}).add(() => {
						this.isPosting = false;
					});
			}
		}
	}

	planesCabeceraEditAndRender() {

		if (this.planesConvenidosForm.invalid) {
			(<any>Object).values(this.planesConvenidosForm.controls).forEach(control => {
				control.markAsTouched();
			});
			return
		}

		if (this.planesConvenidosForm.valid) {

			this.isPosting = true;

			let planConvenido = new PlanConvenidoDTO();
			planConvenido = this.currentPlan;
			planConvenido.edicion = true;
			planConvenido.porcentaje = this.planesConvenidosForm.value["porcentaje"];
			planConvenido.cabecera = this.cabeceraConvenio;
			planConvenido.vigencia = this.cabeceraConvenio.vigencia;
			planConvenido.cantidadGruposParaBonificar = this.cabeceraConvenio.cantidadGruposParaBonificar;
			planConvenido.cantidadIntegrantesParaBonificar = this.cabeceraConvenio.cantidadIntegrantesParaBonificar;

			console.log(JSON.stringify(planConvenido), 'planConvenido antes enviar plan (edicion)');

			this.planesConvenidosService.addPlanConvenidoD(planConvenido)
				.subscribe(res => {
					this.planesConvenidosService.getCabeceraConvenioD(this.convenioIdFlag)
						.subscribe(res => {
							this.utilService.notification('¡Registro modificado con éxito!', 'success', 4000);
							this.planesConvenidosService.getPlanesConvenidosD(res[0])
								.subscribe(res => {
									if (res == null) res = [];
									this.cabeceraDataSource.data = res
								});
						}).add(() => {
							this.isPosting = false;
						});
				});

			this.cancelEdit();

		}

	}

	planesCabeceraDelete(row) {

		if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: '',
				texto: '¿Desea eliminar este registro de plan convenido?',
				confirmar: 'Eliminar',
				cancelar: 'Cancelar'
			});

			this.utilService.loseFocus();

			this.dialogRef.afterClosed().toPromise().then((respuesta) => {

				if (respuesta) {

					this.isPosting = true;

					this.planesConvenidosService.deletePlanesConvenidosD(row)
						.subscribe(res => {
							this.planesConvenidosService.getCabeceraConvenioD(this.convenioIdFlag)
								.subscribe(res => {
									this.utilService.notification('¡Registro eliminado con éxito!', 'success', 4000);
									this.planesConvenidosService.getPlanesConvenidosD(res[0])
										.subscribe(res => {
											if (res == null) res = [];

											this.cabeceraDataSource.data = res
										});
								}).add(() => {
									this.isPosting = false;
								});
						});
				}

				this.dialogRef = null;
			});
		}
	}

	planesCabeceraEdit(row) {

		console.log(row);

		this.edicionPlanExistente = true;
		this.isEditionFlag = true;
		this.changeEditionFlag.emit(true);
		this.currentPlan = row;
		this.planesConvenidosForm.patchValue(row);

	}

	cancelEdit() {

		this.isEditionFlag = false;
		this.changeEditionFlag.emit(false);
		this.edicionPlanExistente = false;
		this.currentPlan = null;
		this.planesConvenidosForm.reset();

	}

	isPosting = false;
}
