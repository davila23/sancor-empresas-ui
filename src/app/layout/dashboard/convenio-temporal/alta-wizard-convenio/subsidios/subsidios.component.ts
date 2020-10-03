import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { ProductoDTO } from '@app/models/producto.model';
import { PlanDTO } from '@app/models/plan.model';
import { SubsidioEmpresaDTO } from '@app/models/subsidio-empresa.model';
import { ConvenioDTO } from '@app/models/convenio-temporal/convenio.model';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { UtilService } from '@app/core';

@Component({
	selector: 'app-subsidios',
	templateUrl: './subsidios.component.html',
	styleUrls: ['./subsidios.component.scss']
})
export class SubsidiosComponent implements OnInit {

	private _convenioId = new BehaviorSubject<number>(0);
	productoCtrl = new FormControl();
	filteredProductos: Observable<any[]>;
	productosList: Observable<any[]>;
	planesList: PlanDTO[] = [];
	subsidiosForm: FormGroup;
	dialogRef = null;

	constructor(private _fb: FormBuilder,
		private subsidiosService: SubsidiosService,
		private utilService: UtilService) { }

	ngOnInit(): void {
		this.subsidiosForm = this._fb.group({
			plan: ['', [Validators.required]],
			producto: ['', [Validators.required]]
		});

		this.subsidiosService.getListaProductosSubsidios().subscribe(
			result => {
				console.log(result["listaResultado"]);
				this.productosList = result["listaResultado"];
				console.log(this.productosList);
			}
		);

		this._convenioId.subscribe(x => {
			this.subsidiosService.getSubsidiosPorEmpresa(x).subscribe(
				res => {
					console.log(res);
					if (res == null) {
						res = [];
					}
					this.subsidiosDataSource.data = res;
				}
			)
		});

		this.filteredProductos = this.productoCtrl.valueChanges.pipe(
			startWith(''),
			//debounceTime(300),
			switchMap(value => {

				if (typeof value === "object") {
					value = this.productoCtrl.value.descripcion;
				}
				if (value !== '') {
					return this.lookup(value);
				} else {
					return of(null);
				}
			})

		)
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
			this.productoCtrl.setValue(evt.source.value);
			let codigo = evt.source.value.codigo;

			this.subsidiosService.getListaPlanesByProducto(codigo).subscribe(
				result => {
					console.log(result);
					this.planesList = result["listaResultado"];
					this.isPosting = false;
				}
			)
		}
	}

	subsidios_displayedColumns = [
		'producto',
		'plan',
		'delete'
	];

	subsidiosDataSource = new MatTableDataSource<any>([]);

	subsidiosDataSourceSaveAndRender() {

		if (this.subsidiosForm.invalid) {
			(<any>Object).values(this.subsidiosForm.controls).forEach(control => {
				control.markAsTouched();
			});
			return
		}

		if (this.subsidiosForm.valid) {

			this.isPosting = true;

			let subsidioEmpresaDTO = new SubsidioEmpresaDTO();
			subsidioEmpresaDTO.plan = this.subsidiosForm.value["plan"];
			subsidioEmpresaDTO.producto = this.productoCtrl.value;
			let convenio = new ConvenioDTO();
			convenio.id = this.convenioIdFlag;
			subsidioEmpresaDTO.convenio = convenio;
			let empresa = new EmpresaDTO();
			empresa.id = this.empresaIdFlag;
			subsidioEmpresaDTO.empresa = empresa;

			this.subsidiosService.addSubsidiosPorEmpresa(subsidioEmpresaDTO)
				.subscribe(res => {
					this.utilService.notification('¡Subsidio agregado con éxito!', 'success', 4000);
					this.subsidiosService.getSubsidiosPorEmpresa(this.convenioIdFlag)
						.subscribe(res => {
							if (res == null) res = [];

							this.subsidiosDataSource.data = res;
						});
				}).add(() => {
					this.isPosting = false;
				});
		}

	}

	subsidiosDelete(row) {
		if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: '',
				texto: '¿Desea eliminar este registro de subsidios?',
				confirmar: 'Eliminar',
				cancelar: 'Cancelar'
			});

			this.utilService.loseFocus();

			this.dialogRef.afterClosed().toPromise().then((respuesta) => {

				if (respuesta) {
					this.isPosting = true;

					this.subsidiosService.deleteSubsidiosEmpresa(row)
						.subscribe(res => {
							this.utilService.notification('¡Subsidio eliminado con éxito!', 'success', 4000);
							this.subsidiosService.getSubsidiosPorEmpresa(this.convenioIdFlag)
								.subscribe(res => {
									if (res == null) res = [];

									this.subsidiosDataSource.data = res
								});
						}).add(() => {
							this.isPosting = false;
						});
				}

				this.dialogRef = null;
			});
		}
	}

	@Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
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

	@Input() set convenioId(convenioId) {
		this._convenioId.next(convenioId);
		setTimeout(() => {
			if (this.isEditionFlag) {
				this.convenioIdFlag = convenioId;
			}
		});
	}

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	isPosting = false;

}
