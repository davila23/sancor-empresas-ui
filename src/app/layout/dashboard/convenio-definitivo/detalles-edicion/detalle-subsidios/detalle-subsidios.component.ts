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
	selector: 'detalle-subsidios',
	templateUrl: './detalle-subsidios.component.html',
	styleUrls: ['./detalle-subsidios.component.scss']
})
export class DetalleSubsidiosComponent implements OnInit {

	productoCtrl = new FormControl();
	filteredProductos: Observable<any[]>;
	productosList: Observable<any[]>;
	planesList: PlanDTO[] = [];
	subsidiosForm: FormGroup;
	dialogRef = null;

	subsidiosDataSource = new MatTableDataSource<any>([]);


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

				this.productosList = result["listaResultado"];
				//this.subsidiosDataSource.data = result["listaResultado"];
				console.log(this.productosList);
			}
		);

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

		);
		this.fillTable();
	}

	fillTable() {
		this.subsidiosService.getSubsidiosPorEmpresaD(this.convenioIdFlag)
			.subscribe(res => {
				console.log(res);
				if (res == null) res = [];

				this.subsidiosDataSource.data = res;
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
			this.productoCtrl.setValue(evt.source.value);
			let codigo = evt.source.value.codigo;

			this.subsidiosService.getListaPlanesByProducto(codigo)
				.subscribe(result => {
					this.planesList = result["listaResultado"];
				})
				.add(() => {
					this.isPosting = false;
				});
		}
	}

	subsidios_displayedColumns = [
		'producto',
		'plan',
		'delete'
	];



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

			this.subsidiosService.addSubsidiosPorEmpresaD(subsidioEmpresaDTO)
				.subscribe(res => {
					this.utilService.notification('¡Subsidio agregado con éxito!', 'success', 4000);
					console.log(res);
					this.fillTable();
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

					this.subsidiosService.deleteSubsidiosEmpresaD(row)
						.subscribe(res => {
							this.utilService.notification('¡Subsidio eliminado con éxito!', 'success', 4000);
							console.log(res);
							this.fillTable();
						}).add(() => {
							this.isPosting = false;
						});
				}

				this.dialogRef = null;
			});
		}
	}

	@Input() set isEdition(isEdition) {
		this.isEditionFlag = isEdition;
	} isEditionFlag = false;

	@Input() set empresaId(empresaId) {
		this.empresaIdFlag = empresaId;
	} empresaIdFlag = null;

	@Input() set convenioId(convenioId) {
		this.convenioIdFlag = convenioId;
		this.fillTable();
	} convenioIdFlag = null;

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

	isPosting = false;
}