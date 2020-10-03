import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { ProductoGrillaEmpresaDTO } from '@app/models/producto-grilla-empresa.model';
import { GrillaDTO } from '@app/models/grilla.model';
import { ConvenioDTO } from '@app/models/convenio-temporal/convenio.model';
import { GrillaTipo } from '@app/models/grilla-tipo.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilService } from '@app/core/util.service';

@Component({
	selector: 'app-grillas',
	templateUrl: './grillas.component.html',
	styleUrls: ['./grillas.component.scss']
})
export class GrillasComponent implements OnInit {

	grillasForm: FormGroup;
	grillasProductoDataSource = new MatTableDataSource<any>([]);
	caracteristicas_list: GrillaTipo[] = [];
	grillaCtrl = new FormControl('', Validators.required);
	filteredGrillas: Observable<GrillaDTO[]>;
	grillasEspeciales: GrillaDTO[] = [];

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

	constructor(
		private _fb: FormBuilder,
		private grillaEmpresaService: GrillaEmpresaService,
		private utilService: UtilService
	) {
		this.grillasForm = this._fb.group({
			seleccion: ['', [Validators.required]],
			staff: [false]
		});
	}

	ngOnInit(): void {
		this.grillaEmpresaService.getGrillasTiposByEjecutivo("S").subscribe(
			r => {
				this.caracteristicas_list = r;
				console.log(this.caracteristicas_list)
			});

		this.grillaEmpresaService.getGrillasEspeciales().subscribe(
			r => {
				this.grillasEspeciales = r;
			});

		this.filteredGrillas = this.grillaCtrl.valueChanges.pipe(
			startWith(''),
			map(grilla => grilla ? this.filterGrillas(grilla) : this.grillasEspeciales.slice())
		);
	}

	filterGrillas(name: string) {
		return this.grillasEspeciales.filter(grilla => (grilla.nrogrilla.toString().includes(name.toString()) || grilla.nombre.toLowerCase().includes(name.toString().toLowerCase())));
	}

	onEnter(evt: any) {
		if (evt.source.selected) {
			this.grillaCtrl.setValue(evt.source.value.nrogrilla + ' - ' + evt.source.value.nombre);
		}
	}

	fillGrillas() {
		this.isPosting = true;
		this.grillaEmpresaService.getAllGrillas(this.convenioIdFlag)
			.subscribe(
				r => {
					if (r == null) r = [];
					this.grillasProductoDataSource.data = r;
					this.isPosting = false;
				},
				error => {
					this.isPosting = false;
				});
	}

	grillasSaveAndRender() {

		if (this.grillasForm.invalid && !this.grillasForm.controls['staff'].value) {
			return
		}

		if (this.grillaCtrl.invalid && this.grillasForm.controls['seleccion'].value == 6) {
			this.grillaCtrl.markAsTouched();
			return
		}

		if (this.grillaCtrl.value && this.grillasForm.controls['seleccion'].value == 6) {
			if (this.grillaCtrl.value.nrogrilla == null) {
				this.grillaCtrl.setValue('');
				this.utilService.notification('Debe seleccionar una Grilla de la lista', 'warning');
				return
			}
		}

		this.isPosting = true;

		let pge = new ProductoGrillaEmpresaDTO();

		let convenio = new ConvenioDTO();
		convenio.id = this.convenioIdFlag;
		pge.convenio = convenio;

		let grilla: GrillaDTO = new GrillaDTO();
		grilla.list = null;

		let nrogrilla = null;
		let caracteristicas = null;
		if (this.grillasForm.valid) {
			caracteristicas = this.grillasForm.controls['seleccion'].value;
			if (this.grillaCtrl.value) {
				nrogrilla = this.grillaCtrl.value.nrogrilla ? this.grillaCtrl.value.nrogrilla : this.grillasForm.controls['seleccion'].value;
			} else {
				nrogrilla = this.grillasForm.controls['seleccion'].value;
			}
		}

		if (this.grillasForm.controls['staff'].value) {
			if (nrogrilla) {
				grilla.list = [];
				grilla.list.push(Number(this.caracteristicas_list.filter(x => x.descripcion == 'Staff')[0].id));
				grilla.list.push(Number(caracteristicas));
				if(caracteristicas == 6){
					grilla.nrogrillaEspecial = nrogrilla;
				}
			} else{
				grilla.caracteristicas = this.caracteristicas_list.filter(x => x.descripcion == 'Staff')[0].id;
				grilla.nrogrilla = this.caracteristicas_list.filter(x => x.descripcion == 'Staff')[0].id;
			}
		} else{
			grilla.nrogrilla = nrogrilla;
			grilla.caracteristicas = caracteristicas;
		}

		pge.grilla = grilla;

		this.grillaEmpresaService.addGrillaConvenioProducto(pge)
			.subscribe(
				res => {
					this.isPosting = false;
					this.fillGrillas();
				},
				error => {
					this.isPosting = false;
				});
	}

	changeGrilla() {
		this.grillaCtrl.reset();
	}

	clearForms(){
		this.grillasForm.reset();
		this.grillaCtrl.reset();
	}

}
