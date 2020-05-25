import { Component, OnDestroy, OnInit, EventEmitter, Output, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { ProductoGrillaEmpresaDTO } from '@app/models/producto-grilla-empresa.model';
import { GrillaDTO } from '@app/models/grilla.model';
import { ConvenioDTO } from '@app/models/convenio-temporal/convenio.model';

@Component({
	selector: 'app-grillas',
	templateUrl: './grillas.component.html',
	styleUrls: ['./grillas.component.scss']
})
export class GrillasComponent implements OnInit {

	constructor(private _fb: FormBuilder,
		private grillaEmpresaService: GrillaEmpresaService) {

		this.grillasForm = this._fb.group({
			seleccion: ['', [Validators.required]],
			nroGrilla: ['', Validators.required]
		});
	}

	grillasForm: FormGroup;
	grillasDataSource = new MatTableDataSource<any>([]);
	grillasProductoDataSource = new MatTableDataSource<any>([]);
	grillaProductos: any[] = [];

	caracteristicas_list = [
		{ id: 2, caracteristica: 'Nuevas Pymes', nroGrilla: 1111, descripcion: 'Descripción no editable', tipo: "PYME" },
		//{ id: 2, caracteristica: 'Negocios especiales', nroGrilla: 2222, descripcion: 'Descripción no editable', tipo: 'NEGOCIOESP' },
		//{ id: 3, caracteristica: 'TC/CBU', nroGrilla: 3333, descripcion: 'Descripción no editable', tipo: 'TC-CBU' }
		{ id: 4, caracteristica: 'Comunes', nroGrilla: 4444, descripcion: 'Descripción no editable', tipo: 'COMUN' },
		{ id: 23, caracteristica: 'Pyme Comp. 10-49', nroGrilla: 2323, descripcion: 'Descripción no editable', tipo: 'PYME COMP. 10-49' },
		{ id: 24, caracteristica: 'Pyme Comp. 50-200', nroGrilla: 2424, descripcion: 'Descripción no editable', tipo: 'PYME COMP. 50-200' },
		//{ id: 5, caracteristica: 'Afinidad', nroGrilla: 5555, descripcion: 'Descripción no editable', tipo: 'AFINIDAD' },
		{ id: 6, caracteristica: 'Especiales', nroGrilla: 6666, descripcion: 'Descripción no editable', tipo: 'ESPECIAL' }
	];

	grillas_displayedColumns = [
		'descripcion'
	];

	grillasProducto_displayedColumns = [
		'idGrilla',
		'grilla'
	];

	edit = false;

	isPosting = false;

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.grillasProductoDataSource.paginator = this.paginator;
	} private paginator: MatPaginator;

	@Input() set isAllowedToEdit(boolean) {
		setTimeout(() => {
			this.edit = boolean;
		});
	}

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	} isEditionFlag = false;

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	} empresaIdFlag = null;

	@Input() set convenioId(convenioId) {
		setTimeout(() => {
			this.convenioIdFlag = convenioId;
			this.fillGrillas();
		});
	} convenioIdFlag = null;


	ngOnInit(): void { }

	fillGrillas() {
		this.isPosting = true;

		this.grillaEmpresaService.getAllGrillas(this.convenioIdFlag)
			.subscribe(r => {
				if (r == null) r = [];

				this.grillasProductoDataSource.data = r;
			}).add(() => {
				this.isPosting = false;
			});
	}

	grillasSaveAndRender() {

		this.isPosting = true;

		let pge = new ProductoGrillaEmpresaDTO();

		let convenio = new ConvenioDTO();
		convenio.id = this.convenioIdFlag;
		pge.convenio = convenio;

		let grilla = new GrillaDTO();
		grilla.caracteristicas = this.caracteristicaElegida.id;

		grilla.nrogrilla = (this.nrogrillaSelected) ? this.nrogrillaSelected : this.grillasForm.get('nroGrilla').value;

		pge.grilla = grilla;

		this.grillaEmpresaService.addGrillaConvenioProducto(pge)
			.subscribe(res => {
				this.fillGrillas();
			});
	}

	grillasDelete(row) {

		let grillaId = row["grilla"]["nrogrilla"];
		let convenioId = row["convenio"]["id"];
		let productId = row["producto"]["codigo"];

		this.grillaEmpresaService.deleteGrillaConvenioProducto(grillaId, convenioId, productId)
			.subscribe(res => {
				this.fillGrillas();
			});
	}

	nrogrillaSelected: any;
	caracteristicaSelected: number;

	applyFilter(event: any) {
		event.preventDefault();

		if (event.key === 'Enter') {
			if (this.caracteristicaSelected) {
				this.nrogrillaSelected = event.target.value;
				this.grillaEmpresaService.getGrillasPorNroGrilla(event.target.value)
					.subscribe(res => {
						this.grillasDataSource.data = res;
					});
			}
		}
	}

	caracteristicaElegida: any;

	patchNroGrilla(caracteristica: any) {

		this.caracteristicaElegida = caracteristica;

		if (caracteristica.tipo == 'ESPECIAL') {
			this.caracteristicaSelected = 5;
		} else {

			this.grillaEmpresaService.getGrillasPorCaracteristica(caracteristica.tipo)
				.subscribe(r => {
					if (r == null) r = [];

					this.grillaProductos = r;
					let unique = Array.from(new Set(r.map((item: any) => item.descripcion)));
					this.grillasDataSource.data = unique;
				});
		}

		this.grillasForm.patchValue({ nroGrilla: caracteristica.nroGrilla });

	}

}
