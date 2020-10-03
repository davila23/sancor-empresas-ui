import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { CondicionIvaService } from '@app/services/condicion-iva/condicion-iva.service';
import { CondicionIvaDTO } from '@app/models/empresa/condicion-iva-model';
import { map, startWith, tap, filter } from 'rxjs/operators';
import { ActividadAfipDTO } from '@app/models/empresa/actividad-afip.model';
import { Observable } from 'rxjs';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { UtilService } from '@app/core';
import { Router } from '@angular/router';
import { ResponsableNegocioDTO } from '@app/models/empresa/responsable-negocio.model';
import { CustomValidators } from '@app/shared/custom-validators';


export class State {
	constructor(public name: string, public population: string, public flag: string) { }
}

@Component({
	selector: 'app-new-empresa',
	templateUrl: './new-empresa.component.html',
	styleUrls: ['./new-empresa.component.scss']
})
export class NewEmpresaComponent implements OnInit {

	empresa: EmpresaDTO;
	formGroup: FormGroup;
	respNegocioForm: FormGroup;

	actividadAfip: FormControl = new FormControl();
	filteredOptionsActividad: any;
	actividadCtrl: FormControl;
	filteredActividades: Observable<any[]>;
	codPostalControl = new FormControl('', [Validators.required]);
	codPostalList: any = [];

	posting = false;
	dialogRef = null;

	empresaCopia: string;

	listaResponsablesDeNegocio: ResponsableNegocioDTO[] = [];

	constructor(private empresaService: EmpresaService,
		private condicionIvaService: CondicionIvaService,
		private contactoService: ContactoService,
		private formBuilder: FormBuilder,
		private utilService: UtilService,
		private router: Router) {

		this.actividades = JSON.parse(localStorage.getItem('actividades'));

		if (this.actividades == null) {
			this.empresaService.obtenerActividadesEmpresa()
				.subscribe(res => {
					localStorage.setItem('actividades', JSON.stringify(res));
				});
		}
	}

	filterStates(name: string) {
		return this.actividades.filter(actividad =>
			actividad.descripcion.toLowerCase().indexOf(name.toString().toLowerCase()) === 0);
	}

	onEnter(evt: any) {
		if (evt.source.selected) {
			this.actividadCtrl.setValue(evt.source.value.descripcion);
			this.formGroup.controls['actividadAfip'].setValue(evt.source.value);
		}
	}

	condicionesIva: CondicionIvaDTO[];
	actividades: ActividadAfipDTO[] = [];
	filteredOptions: Observable<ActividadAfipDTO[]>;

	ngOnInit() {
		this.actividadCtrl = new FormControl();
		this.filteredActividades = this.actividadCtrl.valueChanges
			.pipe(
				startWith(''),
				map(actividad => actividad ? this.filterStates(actividad) : this.actividades.slice())
			);

		this.condicionIvaService.getCondicionesIva().subscribe(
			res => this.condicionesIva = res
		)
		this.createForm();

		this.formGroup.valueChanges.subscribe(console.log);
	}

	cuitValidator(control: AbstractControl) {
		return this.empresaService.searchEmpresas(control.value).pipe(
			map(res => {
				return res[0] ? { cuitExistente: true } : null;
			})
		);
	}

	createForm() {
		this.formGroup = this.formBuilder.group({
			id: [],
			cuit: [null, [CustomValidators.cuit, Validators.required]],
			razonSocial: [null, [Validators.required, Validators.maxLength(100)]],
			condicionIvaId: [null, Validators.required],
			numeroIngresosBrutos: [null],
			actividadAfip: [null],
			estado: [null],
			calle: [null, [Validators.required, Validators.maxLength(30)]],
			numeroCalle: [null, Validators.required],
			piso: [null],
			departamento: [null, [Validators.maxLength(5)]],
			cpLocalidad: [null, [Validators.required, Validators.maxLength(8)]],
			cpArgentino: [null, [Validators.required, Validators.maxLength(8)]],
			telFijo: [null, [Validators.maxLength(50)]],
			telCelular: [null, [Validators.maxLength(50)]],
			email: [null, [Validators.email, Validators.maxLength(50)]]
		});

		this.respNegocioForm = this.formBuilder.group({
			nombre: [null, [Validators.required, Validators.maxLength(100)]],
			numeroDocumento: [null, Validators.required],
			tipoDocumento: [null],
			comentario: [null],
		});

		this.empresaCopia = JSON.stringify(this.formGroup.getRawValue());
	}

	addRespNegocio() {
		if (this.respNegocioForm.invalid) {
			return
		}

		let RN: ResponsableNegocioDTO = new ResponsableNegocioDTO();
		RN.nombre = this.respNegocioForm.controls['nombre'].value;
		RN.numeroDocumento = this.respNegocioForm.controls['numeroDocumento'].value;
		RN.comentario = this.respNegocioForm.controls['comentario'].value;
		RN.tipoDocumento = "DNI";

		this.listaResponsablesDeNegocio.push(RN);

		this.respNegocioForm.reset();
	}

	deleteRespNegocio(element) {
		let list = [];
		this.listaResponsablesDeNegocio.forEach(x => {
			if (x.nombre != element.nombre || x.numeroDocumento != element.numeroDocumento || x.comentario != element.comentario) {
				list.push(x);
			}
		});
		this.listaResponsablesDeNegocio = list;
	}

	onSubmit() {
		if (this.formGroup.valid && this.codPostalControl.valid) {
			this.posting = true;
			let condicionIva = new CondicionIvaDTO();
			condicionIva.id = this.formGroup.controls.condicionIvaId.value;
			this.empresa = this.formGroup.value as EmpresaDTO;
			this.empresa.condicionIva = condicionIva;
			this.empresa.usuario = "supervisor";
			this.empresa.estado = "1";

			this.empresa.cuit = Number(this.empresa.cuit.toString().replace(/-/g, ''));

			this.empresaService.addEmpresa(this.empresa).subscribe(r => {
				if (r) {
					if (r.errores.length > 0) {
						this.utilService.openConfirmDialog(
							{
								titulo: 'No fue posible completar la acción',
								texto: r.errores[0].detalle,
								confirmar: 'ACEPTAR'
							});
					} else {
						let errores = null;
						this.listaResponsablesDeNegocio.forEach(x => {
							x.empresaID = r.id
							this.empresaService.postResponsablesNegocio(x).subscribe(
								resp => {
									if(r != []){
										errores = 'Ocurrió un error al agregar un responsable de negocio';
									}
								});
						});
						if(errores){
							this.utilService.notification(errores, 'error');
						}
						this.utilService.notification('¡Empresa añadida!', 'success');
						this.router.navigate(['/empresa/busqueda']);
					}
				}
			}).add(() => {
				this.posting = false;
			});
		}
	}

	codigoPostalListFill(val) {
		setTimeout(() => {
			this.contactoService.getLocalidades(val).subscribe(r => {
				this.codPostalList = r.listaResultado;
			});
		}, 400);
	}

	cancel() {
		if (JSON.stringify(this.formGroup.getRawValue()) !== this.empresaCopia) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: '',
				texto: 'Está seguro que desea descartar los datos?',
				confirmar: 'Sí',
				cancelar: 'No'
			});
			this.dialogRef.afterClosed().toPromise().then((respuesta) => {
				if (respuesta) {
					this.router.navigate(['/empresa/busqueda']);
				}
				this.dialogRef = null
			});
		} else {
			this.router.navigate(['/empresa/busqueda']);
		}
	}

	codigoPostalPatchValue(cod, $event?) {
		let val = cod.codigoPostal;

		this.formGroup.patchValue({
			cpLocalidad: val,
			cpArgentino: String(val)
		});
	}

}
